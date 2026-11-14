import fs from 'fs';
import path from 'path';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { womenCategoriesList, womenProducts } from '../../data/womenProducts.js';
import { getDeliveryFee, getProvinceForCity } from '../orders/delivery.js';
import {
  saveDocToAtlas,
  updateDocInAtlas,
  deleteDocFromAtlas,
  saveSettingsToAtlas,
  fetchAllFromAtlas,
  seedEmptyCollectionsFromJson,
  persistDocumentsToAtlas,
} from './mongodb.js';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
let hasMigratedCatalogOnDisk = false;
const DEFAULT_SETTINGS = {
  storeName: 'FASHIONSTORE',
  storeTagline: 'WEAR YOUR STORY',
  currencyCode: 'LKR',
  currencySymbol: 'Rs.',
  enabledCurrencies: ['LKR', 'USD'],
  lkrPerUsd: 300,
  lowStockThreshold: 10,
  supportEmail: 'concierge@fashionstore.com',
  supportPhone: '+94 11 234 5678',
  freeShippingThreshold: 15000,
  standardShippingFee: 450,
  address: 'Atelier Flagship, Colombo 07, Sri Lanka',
};

import { defaultMenCategories, defaultMenProducts, defaultCollectionsList } from '../../data/catalogDefaults.js';

export { defaultMenCategories, defaultMenProducts, defaultCollectionsList };

const collectionSlugAliases = {
  'evening-wear': 'evening-occasion-wear',
  'new-arrivals': 'new-season',
  summer: 'seasonal-edit',
  essentials: 'seasonal-edit',
  'best-sellers': 'seasonal-edit',
};

function normalizeCollectionSlug(slug) {
  return collectionSlugAliases[slug] || slug;
}

function restoreImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string') return imageUrl;
  const match = imageUrl.match(/^Error: Invalid src prop \((https?:\/\/[^)]+)\) on `next\/image`/);
  return match ? match[1] : imageUrl;
}

function sanitizeProductImageSources(db) {
  let changed = false;
  const products = (db.products || []).map((product) => {
    let productChanged = false;
    const image = restoreImageUrl(product.image);
    if (image !== product.image) productChanged = true;

    const images = Array.isArray(product.images)
      ? product.images.map((item) => {
          if (typeof item === 'string') {
            const url = restoreImageUrl(item);
            if (url !== item) productChanged = true;
            return url;
          }
          if (!item || typeof item !== 'object') return item;
          const url = restoreImageUrl(item.url);
          if (url === item.url) return item;
          productChanged = true;
          return { ...item, url };
        })
      : product.images;

    const colors = Array.isArray(product.colors)
      ? product.colors.map((color) => {
          if (!color || typeof color !== 'object') return color;
          const colorImage = restoreImageUrl(color.image);
          if (colorImage === color.image) return color;
          productChanged = true;
          return { ...color, image: colorImage };
        })
      : product.colors;

    if (!productChanged) return product;
    changed = true;
    return { ...product, image, images, colors };
  });

  return changed ? { ...db, products } : db;
}

function migrateCatalogCategories(db) {
  const womenCategories = womenCategoriesList.map((category, index) => ({
    ...category,
    gender: 'women',
    isActive: true,
    displayOrder: index + 1,
  }));
  const menCategories = defaultMenCategories;
  const canonicalCategories = [...womenCategories, ...menCategories];
  const categoryAliases = {
    women: {
      tops: 'tops',
      dresses: 'dresses',
      denim: 'jeans',
      jeans: 'jeans',
      skirts: 'skirts',
      accessories: 'accessories',
    },
    men: {
      shirts: 'shirts',
      jeans: 'jeans',
      trousers: 'jeans',
      outerwear: 'outerwear',
      knitwear: 'outerwear',
      accessories: 'accessories',
    },
  };
  let changed = false;

  const migratedProducts = (db.products || []).map((product) => {
    const gender = product.gender;
    const canonicalSlug = categoryAliases[gender]?.[product.categorySlug];
    if (!canonicalSlug) return product;

    const category = canonicalCategories.find(
      (item) => item.gender === gender && item.slug === canonicalSlug
    );
    if (!category) return product;

    const needsReview = gender === 'men' && product.categorySlug === 'knitwear';
    const updatedProduct = {
      ...product,
      category: category.title,
      categorySlug: category.slug,
      ...(needsReview
        ? {
            needsCategoryReview: true,
            categoryReviewReason: 'Knitwear has no dedicated category in the requested structure.',
          }
        : {}),
    };
    if (JSON.stringify(product) !== JSON.stringify(updatedProduct)) changed = true;
    return updatedProduct;
  });

  const invalidProducts = migratedProducts.filter((product) =>
    !canonicalCategories.some(
      (category) =>
        category.gender === product.gender &&
        category.slug === product.categorySlug &&
        category.title === product.category
    )
  );
  if (invalidProducts.length) {
    console.error(
      'Category migration aborted; products need assignment review:',
      invalidProducts.map((product) => product.id).join(', ')
    );
    return false;
  }

  db.products = migratedProducts;
  const existingCategories = db.categories || [];
  const migratedCategories = canonicalCategories.map((category) => {
    const aliases = category.gender === 'men' && category.slug === 'jeans'
      ? ['jeans', 'trousers']
      : [category.slug];
    const existing = existingCategories.find(
      (item) => item.gender === category.gender && aliases.includes(item.slug)
    );
    return {
      ...category,
      ...(existing || {}),
      id: existing?.id || category.id,
      title: category.title,
      slug: category.slug,
      gender: category.gender,
      href: category.href,
      displayOrder: category.displayOrder,
      isActive: existing?.isActive !== undefined ? existing.isActive : true,
    };
  });

  if (JSON.stringify(existingCategories) !== JSON.stringify(migratedCategories)) {
    db.categories = migratedCategories;
    changed = true;
  }

  return changed;
}

function migrateCatalogCollections(db) {
  let changed = false;
  const existingCollections = db.collections || [];
  const migratedDefaultCollections = defaultCollectionsList.map((defaults) => {
    const aliases = Object.entries(collectionSlugAliases)
      .filter(([, canonicalSlug]) => canonicalSlug === defaults.slug)
      .map(([alias]) => alias);
    const existing = existingCollections.find(
      (collection) => collection.slug === defaults.slug || aliases.includes(collection.slug)
    );

    return {
      ...defaults,
      ...(existing || {}),
      id: existing?.id || defaults.id,
      title: existing?.managedCollectionVersion === 1
        ? existing.title
        : defaults.title,
      slug: defaults.slug,
      displayOrder: defaults.displayOrder,
      managedCollectionVersion: 1,
    };
  });
  const defaultCollectionSlugs = new Set(defaultCollectionsList.map((collection) => collection.slug));
  const customCollections = existingCollections.filter(
    (collection) => !defaultCollectionSlugs.has(normalizeCollectionSlug(collection.slug))
  );
  const migratedCollections = [...migratedDefaultCollections, ...customCollections];

  if (JSON.stringify(existingCollections) !== JSON.stringify(migratedCollections)) {
    db.collections = migratedCollections;
    changed = true;
  }

  const availableCollectionSlugs = new Set(migratedCollections.map((collection) => collection.slug));
  const migratedProducts = (db.products || []).map((product) => {
    const hasCollectionAssignments = Array.isArray(product.collectionSlugs);
    const sourceSlugs = hasCollectionAssignments
      ? product.collectionSlugs
      : [product.collectionSlug].filter(Boolean);
    const collectionSlugs = [...new Set(sourceSlugs.map(normalizeCollectionSlug))];
    const productText = `${product.title || ''} ${product.category || ''} ${product.description || ''}`.toLowerCase();

    if (!hasCollectionAssignments) {
      if (product.isNew) collectionSlugs.push('new-season');
      if (product.categorySlug === 'dresses' || /evening|occasion|party|gown|satin dress|silk dress/.test(productText)) {
        collectionSlugs.push('evening-occasion-wear');
      }
      if (/office|formal|blazer|tailored|oxford|chino|trouser|workwear/.test(productText)) {
        collectionSlugs.push('office-wear');
      }
      if (/linen|summer|resort|lightweight|seasonal/.test(productText)) {
        collectionSlugs.push('seasonal-edit');
      }
    }

    const normalizedSlugs = [...new Set(collectionSlugs)].filter((slug) =>
      availableCollectionSlugs.has(slug)
    );
    const normalizedProduct = {
      ...product,
      collectionSlug: normalizedSlugs[0] || null,
      collectionSlugs: normalizedSlugs,
    };
    if (JSON.stringify(product) !== JSON.stringify(normalizedProduct)) changed = true;
    return normalizedProduct;
  });

  if (changed) db.products = migratedProducts;
  return changed;
}

// Combine all seed products into an initial persistent dataset
function generateInitialDatabase() {
  const allProducts = [];

  // 1. Women Products
  Object.keys(womenProducts).forEach((catKey) => {
    womenProducts[catKey].forEach((p) => {
      // assign appropriate collection if not present
      let col = 'essentials';
      if (p.isNew) col = 'new-season';
      if (p.isSale) col = 'summer';
      if (p.categorySlug === 'dresses') col = 'evening-wear';

      allProducts.push({
        ...p,
        gender: 'women',
        collectionSlug: p.collectionSlug || col,
        stockQuantity: p.stockQuantity || Math.floor(Math.random() * 25) + 8,
        status: 'ACTIVE',
      });
    });
  });

  // 2. Men Products
  Object.keys(defaultMenProducts).forEach((catKey) => {
    defaultMenProducts[catKey].forEach((p) => {
      allProducts.push(p);
    });
  });

  // 3. Categories
  const categories = [
    ...womenCategoriesList.map((c, idx) => ({
      ...c,
      gender: 'women',
      isActive: true,
      displayOrder: idx + 1,
    })),
    ...defaultMenCategories,
  ];

  // 4. Initial Orders
  const orders = [
    {
      id: 'ord-101',
      orderNumber: 'FS-2026-98124',
      customerName: 'Kavindu Perera',
      customerEmail: 'kavindu@gmail.com',
      customerPhone: '+94 77 123 4567',
      shippingAddress: 'No. 42, Ward Place, Colombo 07, Sri Lanka',
      items: [
        {
          id: 'item-1',
          productId: 'top-1',
          productTitle: 'Basic Organic Cotton Crewneck Top',
          quantity: 2,
          price: 4200,
          size: 'M',
          color: 'Alabaster White',
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
        },
        {
          id: 'item-2',
          productId: 'm-sh-1',
          productTitle: 'Relaxed Fit Heavyweight Cotton Overshirt',
          quantity: 1,
          price: 11500,
          size: 'L',
          color: 'Olive Green',
          image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=700&q=80',
        },
      ],
      subtotal: 19900,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 19900,
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'PAID',
      status: 'DELIVERED',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'ord-102',
      orderNumber: 'FS-2026-98125',
      customerName: 'Anuki Fernando',
      customerEmail: 'anuki.f@outlook.com',
      customerPhone: '+94 71 987 6543',
      shippingAddress: '15/3, Galle Road, Mount Lavinia, Sri Lanka',
      items: [
        {
          id: 'item-3',
          productId: 'dress-3',
          productTitle: 'Pleated Accordion Evening Maxi Dress',
          quantity: 1,
          price: 16800,
          size: 'S',
          color: 'Champagne Gold',
          image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80',
        },
      ],
      subtotal: 16800,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 16800,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'PAID',
      status: 'PROCESSING',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'ord-103',
      orderNumber: 'FS-2026-98126',
      customerName: 'Naveen Jayawardena',
      customerEmail: 'naveen.j@gmail.com',
      customerPhone: '+94 76 555 4321',
      shippingAddress: '88, Kandy Road, Kiribathgoda, Sri Lanka',
      items: [
        {
          id: 'item-4',
          productId: 'm-jn-1',
          productTitle: 'Vintage Selvedge Rigid Straight Jeans',
          quantity: 1,
          price: 15200,
          size: '32',
          color: 'Raw Indigo',
          image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=700&q=80',
        },
      ],
      subtotal: 15200,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 15200,
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'UNPAID',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    },
  ];

  // 5. Initial Customers
  const customers = [
    {
      id: 'cust-1',
      name: 'Kavindu Perera',
      email: 'kavindu@gmail.com',
      phone: '+94 77 123 4567',
      address: 'Colombo 07, Sri Lanka',
      totalOrders: 3,
      totalSpent: 48500,
      createdAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'cust-2',
      name: 'Anuki Fernando',
      email: 'anuki.f@outlook.com',
      phone: '+94 71 987 6543',
      address: 'Mount Lavinia, Sri Lanka',
      totalOrders: 2,
      totalSpent: 31200,
      createdAt: '2026-02-04T12:30:00Z',
    },
    {
      id: 'cust-3',
      name: 'Naveen Jayawardena',
      email: 'naveen.j@gmail.com',
      phone: '+94 76 555 4321',
      address: 'Kiribathgoda, Sri Lanka',
      totalOrders: 1,
      totalSpent: 15200,
      createdAt: '2026-02-28T09:15:00Z',
    },
    {
      id: 'cust-4',
      name: 'Dilini Wickramasinghe',
      email: 'dilini.w@gmail.com',
      phone: '+94 70 333 8899',
      address: 'Nugegoda, Sri Lanka',
      totalOrders: 4,
      totalSpent: 62400,
      createdAt: '2026-01-08T14:45:00Z',
    },
  ];

  // 6. Settings
  const settings = {
    ...DEFAULT_SETTINGS,
  };

  // 7. Users
  const users = [
    {
      id: 'usr-admin-1',
      name: 'System Administrator',
      email: 'admin@fashionstore.com',
      passwordHash: bcrypt.hashSync('Admin@FashionStore2026', 10),
      role: 'ADMIN',
      phone: '+94 11 234 5678',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr-admin-14',
      name: 'Admin',
      email: 'admin14@gmail.ik',
      passwordHash: bcrypt.hashSync('admin14', 10),
      role: 'ADMIN',
      phone: '+94 77 123 4567',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr-admin-14-lk',
      name: 'Admin',
      email: 'admin14@gmail.lk',
      passwordHash: bcrypt.hashSync('admin14', 10),
      role: 'ADMIN',
      phone: '+94 77 123 4567',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr-cust-1',
      name: 'Jane Doe',
      email: 'customer@example.com',
      passwordHash: bcrypt.hashSync('Customer@123456', 10),
      role: 'CUSTOMER',
      phone: '+94 77 123 4567',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  return {
    products: allProducts,
    categories,
    collections: defaultCollectionsList,
    orders,
    customers,
    users,
    settings,
  };
}

async function safeAtlasCall(actionName, fn) {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[Atlas Sync Notice] Skipped remote ${actionName} because Atlas is offline: ${err.message}`);
    return null;
  }
}

let lastMongoSyncTime = 0;
const MONGO_SYNC_INTERVAL = 30000; // 30 seconds high-speed memory cache window
let inFlightSyncPromise = null;

export async function ensureMongoReady(force = false) {
  const now = Date.now();
  if (!force && now - lastMongoSyncTime < MONGO_SYNC_INTERVAL) {
    return readDb();
  }

  if (inFlightSyncPromise) {
    return inFlightSyncPromise;
  }

  inFlightSyncPromise = (async () => {
    try {
      const seedData = readDb();
      await seedEmptyCollectionsFromJson(seedData);

      const db = await fetchAllFromAtlas();
      const sanitizedDb = sanitizeProductImageSources(db);
      if (sanitizedDb !== db) {
        await safeAtlasCall('persist sanitized products', () =>
          persistDocumentsToAtlas({
            upserts: (sanitizedDb.products || []).map((document) => ({
              collectionName: 'products',
              document,
            })),
          })
        );
      }

      // Preserve local admin accounts so remote Atlas never wipes them
      if (Array.isArray(seedData.users)) {
        const adminAccounts = seedData.users.filter((u) => u.role === 'ADMIN');
        if (!Array.isArray(sanitizedDb.users)) sanitizedDb.users = [];
        adminAccounts.forEach((admin) => {
          if (!sanitizedDb.users.some((u) => u.email?.toLowerCase() === admin.email?.toLowerCase())) {
            sanitizedDb.users.unshift(admin);
          }
        });
      }

      if (!writeDb(sanitizedDb)) {
        throw new Error('MongoDB data could not be cached locally.');
      }
      lastMongoSyncTime = Date.now();
      return sanitizedDb;
    } catch (err) {
      console.warn(`[MongoDB Warning] Atlas cluster unavailable (${err.message}). Using local JSON store.`);
      return readDb();
    } finally {
      inFlightSyncPromise = null;
    }
  })();

  return inFlightSyncPromise;
}

export const syncFromAtlasOnce = ensureMongoReady;

let memoryDb = null;
let memoryDbMtime = 0;

// Read database from disk with memory cache
export function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const stat = fs.statSync(DB_PATH);
      if (memoryDb && stat.mtimeMs === memoryDbMtime) {
        return memoryDb;
      }

      const raw = fs.readFileSync(DB_PATH, 'utf8');
      let db = JSON.parse(raw);
      let changed = false;
      const sanitizedDb = sanitizeProductImageSources(db);
      if (sanitizedDb !== db) {
        db = sanitizedDb;
        changed = true;
      }
      if (!db.users || !Array.isArray(db.users)) {
        db.users = [];
        changed = true;
      }

      const admin14Hash = bcrypt.hashSync('admin14', 10);
      const admin14Exists = db.users.some(
        (u) => u.email && u.email.toLowerCase() === 'admin14@gmail.ik'
      );
      if (!admin14Exists) {
        db.users.unshift({
          id: 'usr-admin-14',
          name: 'Admin',
          email: 'admin14@gmail.ik',
          passwordHash: admin14Hash,
          role: 'ADMIN',
          phone: '+94 77 123 4567',
          createdAt: '2026-01-01T00:00:00.000Z',
        });
        changed = true;
      }

      const admin14LkExists = db.users.some(
        (u) => u.email && u.email.toLowerCase() === 'admin14@gmail.lk'
      );
      if (!admin14LkExists) {
        db.users.push({
          id: 'usr-admin-14-lk',
          name: 'Admin',
          email: 'admin14@gmail.lk',
          passwordHash: admin14Hash,
          role: 'ADMIN',
          phone: '+94 77 123 4567',
          createdAt: '2026-01-01T00:00:00.000Z',
        });
        changed = true;
      }

      db.users.forEach((u) => {
        if (u.name === 'System Administrator') {
          u.name = 'Admin';
          changed = true;
        }
        if (u.role === 'ADMIN' && (u.email === 'admin14@gmail.ik' || u.email === 'admin14@gmail.lk')) {
          if (!bcrypt.compareSync('admin14', u.passwordHash)) {
            u.passwordHash = admin14Hash;
            changed = true;
          }
        }
      });
      if (changed) {
        writeDb(db);
      } else {
        memoryDb = db;
        memoryDbMtime = stat.mtimeMs;
      }
      return db;
    }
  } catch (err) {
    console.error('Failed reading db.json, generating default:', err.message);
  }

  const initialData = generateInitialDatabase();
  writeDb(initialData);
  return initialData;
}

// Atomically write database to disk with memory cache
export function writeDb(data) {
  let tempPath;
  try {
    const sanitizedData = sanitizeProductImageSources(data);
    const serialized = JSON.stringify(sanitizedData, null, 2);
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_PATH) && fs.readFileSync(DB_PATH, 'utf8') === serialized) {
      memoryDb = sanitizedData;
      try { memoryDbMtime = fs.statSync(DB_PATH).mtimeMs; } catch (_) {}
      return true;
    }
    tempPath = `${DB_PATH}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
    fs.writeFileSync(tempPath, serialized, 'utf8');
    fs.renameSync(tempPath, DB_PATH);
    memoryDb = sanitizedData;
    try { memoryDbMtime = fs.statSync(DB_PATH).mtimeMs; } catch (_) {}
    return true;
  } catch (err) {
    console.error('Failed writing db.json:', err.message);
    if (tempPath && fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.error('Failed cleaning up temporary database cache:', cleanupError.message);
      }
    }
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(sanitizeProductImageSources(data), null, 2), 'utf8');
      return true;
    } catch (e2) {
      console.error('Direct write failed:', e2.message);
      return false;
    }
  }
}

/* ─────────────────── PRODUCTS ─────────────────── */

export function getProducts(filter = {}) {
  const db = readDb();
  let list = db.products || [];

  if (filter.gender) {
    list = list.filter((p) => p.gender === filter.gender || p.gender === 'unisex');
  }
  if (filter.categorySlug) {
    list = list.filter((p) => p.categorySlug === filter.categorySlug);
  }
  if (filter.collectionSlug) {
    const collectionSlug = normalizeCollectionSlug(filter.collectionSlug);
    list = list.filter((product) =>
      (product.collectionSlugs || [product.collectionSlug])
        .map(normalizeCollectionSlug)
        .includes(collectionSlug)
    );
  }
  if (filter.isSale !== undefined) {
    list = list.filter((p) => Boolean(p.isSale) === Boolean(filter.isSale));
  }
  if (filter.isNew !== undefined) {
    list = list.filter((p) => Boolean(p.isNew) === Boolean(filter.isNew));
  }
  if (filter.status) {
    list = list.filter((p) => p.status === filter.status);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  return list;
}

export function getProductById(id) {
  const db = readDb();
  return (db.products || []).find((p) => p.id === id) || null;
}

export function getProductBySlug(slug) {
  const db = readDb();
  return (db.products || []).find((p) => p.slug === slug) || null;
}

export async function createProduct(productData) {
  const db = readDb();
  const primaryImage = productData.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80';
  const imageUrls = [...new Set(
    [primaryImage, ...(Array.isArray(productData.images) ? productData.images : [])]
      .map((image) => (typeof image === 'string' ? image : image?.url))
      .filter(Boolean)
  )];
  const newProduct = {
    id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: productData.title || 'Untitled Garment',
    slug:
      productData.slug ||
      (productData.title || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    gender: productData.gender || 'women',
    category: productData.category || 'General',
    categorySlug: productData.categorySlug || 'general',
    collectionSlugs: [
      ...new Set(
        (productData.collectionSlugs || [productData.collectionSlug || 'new-season'])
          .filter(Boolean)
          .map(normalizeCollectionSlug)
      ),
    ],
    price: Number(productData.price) || 0,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
    isSale: Boolean(productData.isSale),
    isNew: Boolean(productData.isNew),
    stockQuantity: Number(productData.stockQuantity) || 0,
    status: productData.status || 'ACTIVE',
    image: primaryImage,
    images: imageUrls.map((url, sortOrder) => ({ url, isPrimary: sortOrder === 0, sortOrder })),
    description: productData.description || '',
    colors: productData.colors || [{ name: 'Black', hex: '#252525' }],
    sizes: productData.sizes || ['S', 'M', 'L'],
    createdAt: new Date().toISOString(),
  };
  newProduct.collectionSlug = newProduct.collectionSlugs[0] || null;

  db.products = [newProduct, ...(db.products || [])];
  await safeAtlasCall('save product', () => saveDocToAtlas('products', newProduct));
  if (!writeDb(db)) throw new Error('Product could not be saved to local cache.');
  return newProduct;
}

export async function updateProduct(id, updates) {
  const db = readDb();
  const idx = (db.products || []).findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const primaryImage = updates.image || db.products[idx].image;
  const imageUrls = [...new Set(
    [primaryImage, ...(Array.isArray(updates.images) ? updates.images : db.products[idx].images || [])]
      .map((image) => (typeof image === 'string' ? image : image?.url))
      .filter(Boolean)
  )];
  const updatedProduct = {
    ...db.products[idx],
    ...updates,
    image: primaryImage,
    images: imageUrls.map((url, sortOrder) => ({ url, isPrimary: sortOrder === 0, sortOrder })),
    updatedAt: new Date().toISOString(),
  };
  if (
    (updates.gender !== undefined && updates.gender !== db.products[idx].gender) ||
    (updates.categorySlug !== undefined && updates.categorySlug !== db.products[idx].categorySlug)
  ) {
    delete updatedProduct.needsCategoryReview;
    delete updatedProduct.categoryReviewReason;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'collectionSlugs') ||
    Object.prototype.hasOwnProperty.call(updates, 'collectionSlug')) {
    const collectionSlugs = [
      ...new Set(
        (updates.collectionSlugs ?? [updates.collectionSlug])
          .filter(Boolean)
          .map(normalizeCollectionSlug)
      ),
    ];
    updatedProduct.collectionSlugs = collectionSlugs;
    updatedProduct.collectionSlug = collectionSlugs[0] || null;
  }
  db.products[idx] = updatedProduct;
  await safeAtlasCall('update product', () => updateDocInAtlas('products', id, updatedProduct));
  if (!writeDb(db)) throw new Error('Product could not be updated in local cache.');
  return db.products[idx];
}

export async function deleteProduct(id) {
  const db = readDb();
  const exists = (db.products || []).some((p) => p.id === id);
  if (!exists) return false;

  db.products = db.products.filter((p) => p.id !== id);
  await safeAtlasCall('delete product', () => deleteDocFromAtlas('products', id));
  if (!writeDb(db)) throw new Error('Product could not be deleted from local cache.');
  return true;
}

/* ─────────────────── CATEGORIES ─────────────────── */

export function getCategories(filter = {}) {
  const db = readDb();
  let list = db.categories || [];
  if (filter.gender) {
    list = list.filter((c) => c.gender === filter.gender || c.gender === 'unisex');
  }
  if (filter.isActive !== undefined) {
    list = list.filter((c) => Boolean(c.isActive) === Boolean(filter.isActive));
  }
  return list.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
}

export function getCategoryBySlug(slug) {
  const db = readDb();
  return (db.categories || []).find((c) => c.slug === slug) || null;
}

export async function createCategory(catData) {
  const db = readDb();
  const slug =
    catData.slug ||
    catData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const newCat = {
    id: `cat-${Date.now()}`,
    title: catData.title,
    slug,
    gender: catData.gender || 'women',
    href: catData.href || `/${catData.gender || 'women'}/${slug}`,
    description: catData.description || '',
    cta: catData.cta || `Explore ${catData.title}`,
    image: catData.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    itemCount: '0 Styles',
    isActive: catData.isActive !== undefined ? catData.isActive : true,
    displayOrder: Number(catData.displayOrder) || (db.categories || []).length + 1,
  };

  db.categories = [...(db.categories || []), newCat];
  await safeAtlasCall('save category', () => saveDocToAtlas('categories', newCat));
  if (!writeDb(db)) throw new Error('Category could not be saved to local cache.');
  return newCat;
}

export async function updateCategory(id, updates) {
  const db = readDb();
  const idx = (db.categories || []).findIndex((c) => c.id === id);
  if (idx === -1) return null;

  db.categories[idx] = {
    ...db.categories[idx],
    ...updates,
  };
  await safeAtlasCall('update category', () => updateDocInAtlas('categories', id, db.categories[idx]));
  if (!writeDb(db)) throw new Error('Category could not be updated in local cache.');
  return db.categories[idx];
}

export async function deleteCategory(id) {
  const db = readDb();
  const exists = (db.categories || []).some((c) => c.id === id);
  if (!exists) return false;

  db.categories = db.categories.filter((c) => c.id !== id);
  await safeAtlasCall('delete category', () => deleteDocFromAtlas('categories', id));
  if (!writeDb(db)) throw new Error('Category could not be deleted from local cache.');
  return true;
}

/* ─────────────────── COLLECTIONS ─────────────────── */

export function getCollections(filter = {}) {
  const db = readDb();
  let list = db.collections || [];
  if (filter.isActive !== undefined) {
    list = list.filter((c) => Boolean(c.isActive) === Boolean(filter.isActive));
  }
  return list.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
}

export function getCollectionBySlug(slug) {
  const db = readDb();
  return (db.collections || []).find((c) => c.slug === normalizeCollectionSlug(slug)) || null;
}

export async function createCollection(colData) {
  const db = readDb();
  const slug =
    colData.slug ||
    colData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const newCol = {
    id: `col-${Date.now()}`,
    title: colData.title,
    slug,
    description: colData.description || '',
    cta: colData.cta || `Shop ${colData.title}`,
    image: colData.image || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    itemCount: '0 Styles',
    isActive: colData.isActive !== undefined ? colData.isActive : true,
    displayOrder: Number(colData.displayOrder) || (db.collections || []).length + 1,
  };

  db.collections = [...(db.collections || []), newCol];
  await safeAtlasCall('save collection', () => saveDocToAtlas('collections', newCol));
  if (!writeDb(db)) throw new Error('Collection could not be saved to local cache.');
  return newCol;
}

export async function updateCollection(id, updates) {
  const db = readDb();
  const idx = (db.collections || []).findIndex((c) => c.id === id);
  if (idx === -1) return null;

  db.collections[idx] = {
    ...db.collections[idx],
    ...updates,
  };
  await safeAtlasCall('update collection', () => updateDocInAtlas('collections', id, db.collections[idx]));
  if (!writeDb(db)) throw new Error('Collection could not be updated in local cache.');
  return db.collections[idx];
}

export async function deleteCollection(id) {
  const db = readDb();
  const exists = (db.collections || []).some((c) => c.id === id);
  if (!exists) return false;

  db.collections = db.collections.filter((c) => c.id !== id);
  await safeAtlasCall('delete collection', () => deleteDocFromAtlas('collections', id));
  if (!writeDb(db)) throw new Error('Collection could not be deleted from local cache.');
  return true;
}

/* ─────────────────── ORDERS ─────────────────── */

export function getOrders() {
  const db = readDb();
  return (db.orders || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id) {
  const db = readDb();
  return (db.orders || []).find((o) => o.id === id || o.orderNumber === id) || null;
}

export async function updateOrderStatus(id, status, paymentStatus) {
  return updateOrder(id, { status, paymentStatus });
}

export async function updateOrder(id, updates = {}) {
  const db = readDb();
  const idx = (db.orders || []).findIndex((o) => o.id === id || o.orderNumber === id);
  if (idx === -1) return null;

  const current = db.orders[idx];
  const allowed = [
    'status',
    'paymentStatus',
    'customerName',
    'customerEmail',
    'customerPhone',
    'shippingAddress',
    'city',
    'province',
    'shippingFee',
    'discountAmount',
  ];

  allowed.forEach((field) => {
    if (updates[field] !== undefined) {
      current[field] = updates[field];
    }
  });

  if (updates.shippingFee !== undefined || updates.discountAmount !== undefined) {
    const subtotal = Number(current.subtotal) || 0;
    const shippingFee = Number(current.shippingFee) || 0;
    const discountAmount = Number(current.discountAmount) || 0;
    current.totalAmount = subtotal - discountAmount + shippingFee;
  }

  current.updatedAt = new Date().toISOString();

  await safeAtlasCall('update order', () => updateDocInAtlas('orders', current.id, current));
  if (!writeDb(db)) throw new Error('Order could not be updated in local cache.');
  return current;
}

export async function deleteOrder(id) {
  const db = readDb();
  const idx = (db.orders || []).findIndex((o) => o.id === id || o.orderNumber === id);
  if (idx === -1) return false;

  const deleted = db.orders.splice(idx, 1)[0];
  await safeAtlasCall('delete order', () => deleteDocFromAtlas('orders', deleted.id));
  if (!writeDb(db)) throw new Error('Order could not be deleted from local cache.');
  return true;
}

export async function createOrder(orderData) {
  const db = readDb();
  const items = (orderData.items || []).map((item) => {
    const product = (db.products || []).find(
      (entry) => entry.id === item.productId || entry.slug === item.productId
    );
    const quantity = Number(item.quantity);
    if (!product || !Number.isSafeInteger(quantity) || quantity < 1) {
      const error = new Error('An order item is invalid or no longer available.');
      error.status = 400;
      throw error;
    }

    return {
      ...item,
      productId: product.id,
      productTitle: product.title,
      price: Number(product.price) || 0,
      image: item.image || product.image,
      quantity,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const city = String(orderData.city || '').trim();
  const province = getProvinceForCity(city) || String(orderData.province || '').trim();
  const settings = { ...DEFAULT_SETTINGS, ...db.settings };
  const shippingFee = Number.isFinite(Number(orderData.shippingFee))
    ? Number(orderData.shippingFee)
    : getDeliveryFee(city, province);
  const discountAmount = Math.min(
    subtotal,
    Math.max(0, Number(orderData.discountAmount) || 0)
  );
  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: `FS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    receiptToken: randomUUID(),
    customerName: orderData.customerName || 'Anonymous Client',
    customerEmail: orderData.customerEmail || 'client@example.com',
    customerPhone: orderData.customerPhone || '',
    city,
    province,
    shippingAddress: [orderData.streetAddress, city, province, 'Sri Lanka']
      .filter(Boolean)
      .join(', '),
    items,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount: subtotal - discountAmount + shippingFee,
    paymentMethod: orderData.paymentMethod || 'CASH_ON_DELIVERY',
    paymentStatus: orderData.paymentStatus || 'UNPAID',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  db.orders = [newOrder, ...(db.orders || [])];

  // Also decrement stock for ordered items
  const updatedProducts = [];
  items.forEach((item) => {
    const prod = (db.products || []).find((p) => p.id === item.productId || p.slug === item.productId);
    if (prod && typeof prod.stockQuantity === 'number') {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - (item.quantity || 1));
      updatedProducts.push(prod);
    }
  });

  await safeAtlasCall('persist order', () =>
    persistDocumentsToAtlas({
      upserts: [
        { collectionName: 'orders', document: newOrder },
        ...updatedProducts.map((document) => ({ collectionName: 'products', document })),
      ],
    })
  );
  if (!writeDb(db)) throw new Error('Order could not be saved to local cache.');
  return newOrder;
}

/* ─────────────────── CUSTOMERS ─────────────────── */

export function getCustomers() {
  const db = readDb();
  const customers = [...(db.customers || [])];
  const customerEmails = new Set(customers.map((c) => c.email?.toLowerCase()).filter(Boolean));
  for (const user of db.users || []) {
    if (user.role !== 'ADMIN' && user.email && !customerEmails.has(user.email.toLowerCase())) {
      customers.push({
        id: user.id,
        name: user.name || 'Customer',
        email: user.email,
        phone: user.phone || '',
        address: '',
        totalOrders: 0,
        totalSpent: 0,
        createdAt: user.createdAt || null,
      });
      customerEmails.add(user.email.toLowerCase());
    }
  }
  return customers;
}

export async function updateCustomer(idOrEmail, updates = {}) {
  if (!idOrEmail) throw new Error('Customer ID or email is required.');
  const db = readDb();
  const normalized = String(idOrEmail).trim().toLowerCase();

  const userIndex = (db.users || []).findIndex(
    (u) => u.id?.toLowerCase() === normalized || u.email?.toLowerCase() === normalized
  );

  const customerIndex = (db.customers || []).findIndex(
    (c) => c.id?.toLowerCase() === normalized || c.email?.toLowerCase() === normalized
  );

  if (userIndex === -1 && customerIndex === -1) {
    throw new Error('Customer not found.');
  }

  const updatedDocs = [];
  let updatedUser = null;

  if (userIndex !== -1) {
    const user = db.users[userIndex];
    if (updates.name !== undefined) user.name = updates.name.trim();
    if (updates.phone !== undefined) user.phone = updates.phone.trim();
    if (updates.email !== undefined && user.role !== 'ADMIN') user.email = updates.email.trim().toLowerCase();
    if (updates.address !== undefined) user.address = updates.address;
    db.users[userIndex] = user;
    updatedUser = { ...user };
    delete updatedUser.passwordHash;
    delete updatedUser.password;
    updatedDocs.push({ collectionName: 'users', document: user });
  }

  let updatedCustomer = null;
  if (!db.customers) db.customers = [];

  if (customerIndex !== -1) {
    const cust = db.customers[customerIndex];
    if (updates.name !== undefined) cust.name = updates.name.trim();
    if (updates.phone !== undefined) cust.phone = updates.phone.trim();
    if (updates.email !== undefined) cust.email = updates.email.trim().toLowerCase();
    if (updates.address !== undefined) cust.address = updates.address.trim();
    db.customers[customerIndex] = cust;
    updatedCustomer = { ...cust };
    updatedDocs.push({ collectionName: 'customers', document: cust });
  } else if (updatedUser) {
    const newCust = {
      id: `cust-${Date.now()}`,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      address: updates.address || '',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: updatedUser.createdAt || new Date().toISOString(),
    };
    db.customers.push(newCust);
    updatedCustomer = newCust;
    updatedDocs.push({ collectionName: 'customers', document: newCust });
  }

  await safeAtlasCall('update customer', () => persistDocumentsToAtlas({ upserts: updatedDocs }));
  if (!writeDb(db)) throw new Error('Customer data could not be updated in local cache.');

  return updatedCustomer || updatedUser;
}

export async function deleteCustomer(idOrEmail) {
  if (!idOrEmail) throw new Error('Customer ID or email is required.');
  const db = readDb();
  const normalized = String(idOrEmail).trim().toLowerCase();

  const user = (db.users || []).find(
    (u) => u.id?.toLowerCase() === normalized || u.email?.toLowerCase() === normalized
  );

  if (user?.role === 'ADMIN') {
    throw new Error('Administrator accounts cannot be deleted.');
  }

  const deletions = [];

  if (user) {
    db.users = db.users.filter((u) => u.id !== user.id && u.email?.toLowerCase() !== normalized);
    deletions.push({ collectionName: 'users', id: user.id });
  }

  const customer = (db.customers || []).find(
    (c) => c.id?.toLowerCase() === normalized || c.email?.toLowerCase() === normalized
  );

  if (customer) {
    db.customers = db.customers.filter((c) => c.id !== customer.id && c.email?.toLowerCase() !== normalized);
    deletions.push({ collectionName: 'customers', id: customer.id });
  }

  if (!user && !customer) {
    throw new Error('Customer not found.');
  }

  await safeAtlasCall('delete customer', () => persistDocumentsToAtlas({ deletions }));
  if (!writeDb(db)) throw new Error('Customer data could not be deleted from local cache.');

  return { success: true };
}

function findCustomerAccount(db, identifier) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const customer = (db.customers || []).find(
    (entry) =>
      entry.id?.toLowerCase() === normalizedIdentifier ||
      entry.email?.toLowerCase() === normalizedIdentifier
  );
  const user = (db.users || []).find(
    (entry) =>
      entry.id?.toLowerCase() === normalizedIdentifier ||
      entry.email?.toLowerCase() === normalizedIdentifier ||
      (customer && entry.email?.toLowerCase() === customer.email?.toLowerCase())
  );

  if (user?.role === 'ADMIN') return { administrator: true };
  if (!customer && !user) return null;

  const email = customer?.email || user?.email;
  if (!email) return null;

  const orderCount = (db.orders || []).filter(
    (order) => order.customerEmail?.toLowerCase() === email.toLowerCase()
  ).length;

  return {
    customer,
    user,
    id: customer?.id || user?.id,
    name: customer?.name || user?.name || 'Customer',
    email,
    phone: customer?.phone || user?.phone || '',
    createdAt: customer?.createdAt || user?.createdAt || null,
    orderCount,
  };
}

export function getCustomerDeletionCandidate(identifier) {
  if (typeof identifier !== 'string' || !identifier.trim()) return null;
  const db = readDb();
  const candidate = findCustomerAccount(db, identifier);
  if (!candidate || candidate.administrator) return null;

  const { customer, user, ...safeCandidate } = candidate;
  return safeCandidate;
}

export async function anonymizeCustomerAccount(id, confirmationEmail) {
  if (typeof id !== 'string' || !id.trim() || typeof confirmationEmail !== 'string') {
    return { error: 'A customer ID and matching email confirmation are required.', status: 400 };
  }

  const db = readDb();
  const candidate = findCustomerAccount(db, id);
  if (!candidate) return { error: 'Customer not found.', status: 404 };
  if (candidate.administrator) {
    return { error: 'Administrator accounts cannot be deleted here.', status: 403 };
  }
  if (candidate.id !== id || confirmationEmail.trim().toLowerCase() !== candidate.email.toLowerCase()) {
    return { error: 'Customer identity confirmation did not match.', status: 400 };
  }

  const originalEmail = candidate.email.toLowerCase();
  const userIds = new Set([candidate.user?.id, candidate.customer?.id, candidate.id].filter(Boolean));
  const anonymizedEmail = `deleted+${String(candidate.id).replace(/[^a-zA-Z0-9-]/g, '')}@privacy.invalid`;
  const deletedAt = new Date().toISOString();
  const removedUsers = (db.users || []).filter(
    (user) =>
      user.role !== 'ADMIN' &&
      (user.id === candidate.user?.id || user.email?.toLowerCase() === originalEmail)
  );
  const updatedCustomers = (db.customers || [])
    .filter((customer) =>
      customer.id === candidate.customer?.id ||
      customer.email?.toLowerCase() === originalEmail
    )
    .map((customer) => ({
      ...customer,
      name: 'Deleted Customer',
      email: anonymizedEmail,
      phone: '',
      address: '',
      anonymizedAt: deletedAt,
    }));
  const updatedOrders = (db.orders || [])
    .filter((order) => order.customerEmail?.toLowerCase() === originalEmail)
    .map((order) => ({
      ...order,
      customerName: 'Deleted Customer',
      customerEmail: anonymizedEmail,
      customerPhone: '',
      shippingAddress: '',
      ...(userIds.has(order.customerId) ? { customerId: null } : {}),
      customerAnonymizedAt: deletedAt,
    }));

  db.users = (db.users || []).filter(
    (user) =>
      user.role === 'ADMIN' ||
      (user.id !== candidate.user?.id && user.email?.toLowerCase() !== originalEmail)
  );
  db.customers = (db.customers || []).map((customer) =>
    customer.id === candidate.customer?.id ||
    customer.email?.toLowerCase() === originalEmail
      ? {
          ...customer,
          name: 'Deleted Customer',
          email: anonymizedEmail,
          phone: '',
          address: '',
          anonymizedAt: deletedAt,
        }
      : customer
  );
  db.orders = (db.orders || []).map((order) => {
    if (order.customerEmail?.toLowerCase() !== originalEmail) return order;
    return {
      ...order,
      customerName: 'Deleted Customer',
      customerEmail: anonymizedEmail,
      customerPhone: '',
      shippingAddress: '',
      ...(userIds.has(order.customerId) ? { customerId: null } : {}),
      customerAnonymizedAt: deletedAt,
    };
  });

  for (const key of ['carts', 'addresses', 'wishlists']) {
    if (Array.isArray(db[key])) {
      db[key] = db[key].filter((entry) => !userIds.has(entry.userId || entry.customerId));
    }
  }

  await persistDocumentsToAtlas({
    upserts: [
      ...updatedCustomers.map((document) => ({ collectionName: 'customers', document })),
      ...updatedOrders.map((document) => ({ collectionName: 'orders', document })),
    ],
    deletions: removedUsers.map((user) => ({ collectionName: 'users', id: user.id })),
  });
  if (!writeDb(db)) throw new Error('Customer data was updated in MongoDB but the local cache could not be updated.');

  return { success: true, orderCount: candidate.orderCount };
}

/* ─────────────────── INVENTORY ─────────────────── */

export function getInventory() {
  const db = readDb();
  const threshold = db.settings?.lowStockThreshold || 10;
  return (db.products || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    gender: p.gender,
    price: p.price,
    stockQuantity: p.stockQuantity || 0,
    isLowStock: (p.stockQuantity || 0) <= threshold,
    isOutOfStock: (p.stockQuantity || 0) === 0,
    status: p.status || 'ACTIVE',
  }));
}

export async function updateStock(id, newStock) {
  const db = readDb();
  const prod = (db.products || []).find((p) => p.id === id);
  if (!prod) return null;

  prod.stockQuantity = Math.max(0, Number(newStock));
  await safeAtlasCall('update stock', () => updateDocInAtlas('products', id, prod));
  if (!writeDb(db)) throw new Error('Stock could not be updated in local cache.');
  return prod;
}

/* ─────────────────── DASHBOARD STATS ─────────────────── */

export function getAdminStats(period = '30d') {
  const db = readDb();
  const products = db.products || [];
  const orders = db.orders || [];
  const customers = db.customers || [];
  const threshold = db.settings?.lowStockThreshold || 10;

  const periodConfig = {
    '7d': { count: 7, interval: 'day' },
    '30d': { count: 30, interval: 'day' },
    '12m': { count: 12, interval: 'month' },
  }[period] || { count: 30, interval: 'day' };
  const now = new Date();
  const currentBucket = periodConfig.interval === 'day'
    ? Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    : Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
  const salesTrend = Array.from({ length: periodConfig.count }, (_, index) => {
    const offset = index - periodConfig.count + 1;
    const date = periodConfig.interval === 'day'
      ? new Date(currentBucket + offset * 24 * 60 * 60 * 1000)
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
    const key = periodConfig.interval === 'day'
      ? date.toISOString().slice(0, 10)
      : date.toISOString().slice(0, 7);
    const label = periodConfig.interval === 'day'
      ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date)
      : new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(date);

    return { key, label, revenue: 0, orders: 0 };
  });
  const trendByKey = new Map(salesTrend.map((bucket) => [bucket.key, bucket]));

  orders.forEach((order) => {
    if (order.status === 'CANCELLED') return;
    const createdAt = new Date(order.createdAt);
    if (Number.isNaN(createdAt.getTime())) return;

    const key = periodConfig.interval === 'day'
      ? createdAt.toISOString().slice(0, 10)
      : createdAt.toISOString().slice(0, 7);
    const bucket = trendByKey.get(key);
    if (!bucket) return;

    bucket.revenue += Number(order.totalAmount) || 0;
    bucket.orders += 1;
  });

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length;
  const totalCustomers = customers.length;
  const lowStockProducts = products.filter((p) => (p.stockQuantity || 0) <= threshold).length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    totalCustomers,
    lowStockProducts,
    totalRevenue,
    recentOrders: orders.slice(0, 5),
    salesTrend,
  };
}

/* ─────────────────── SETTINGS ─────────────────── */

export function getSettings() {
  const db = readDb();
  return { ...DEFAULT_SETTINGS, ...(db.settings || {}) };
}

export async function updateSettings(newSettings) {
  const db = readDb();
  db.settings = {
    ...DEFAULT_SETTINGS,
    ...db.settings,
    ...newSettings,
  };
  await safeAtlasCall('save settings', () => saveSettingsToAtlas(db.settings));
  if (!writeDb(db)) throw new Error('Settings could not be updated in local cache.');
  return db.settings;
}

/* ─────────────────── USERS & AUTHENTICATION ─────────────────── */

export function getUsers() {
  const db = readDb();
  return (db.users || []).map(({ passwordHash, ...user }) => user);
}

export function getUserByEmail(email) {
  if (!email) return null;
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  return (db.users || []).find((u) => u.email.toLowerCase() === normalized) || null;
}

export function getUserById(id) {
  if (!id) return null;
  const db = readDb();
  const user = (db.users || []).find((entry) => entry.id === id);
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  delete safeUser.password;
  return safeUser;
}

export function verifyUserPassword(email, password) {
  if (!email || !password) return null;
  const user = getUserByEmail(email);
  if (!user) return null;

  // Check bcrypt hash
  if (user.passwordHash) {
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (isMatch) {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    }
  }

  // Backward compatibility with plain text passwords if any
  if (user.password && user.password === password) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  return null;
}

export async function createUser({ name, email, password, phone = '', role = 'CUSTOMER' }) {
  const db = readDb();
  const normalizedEmail = email.trim().toLowerCase();

  if (!db.users) db.users = [];
  if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const saltRounds = 10;
  const passwordHash = bcrypt.hashSync(password, saltRounds);

  const newUser = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'CUSTOMER', // Strict server-side enforcement
    phone: phone ? phone.trim() : '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Sync to customers list for admin visibility
  if (!db.customers) db.customers = [];
  const existingCust = db.customers.find((c) => c.email.toLowerCase() === normalizedEmail);
  let newCust = null;
  if (!existingCust) {
    newCust = {
      id: `cust-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: '',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: newUser.createdAt,
    };
    db.customers.push(newCust);
  }

  await safeAtlasCall('create user', () =>
    persistDocumentsToAtlas({
      upserts: [
        { collectionName: 'users', document: newUser },
        ...(newCust ? [{ collectionName: 'customers', document: newCust }] : []),
      ],
    })
  );
  if (!writeDb(db)) throw new Error('Account could not be saved to local cache.');
  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

export async function updateUserPassword(userId, currentPassword, newPassword) {
  if (!userId || !currentPassword || !newPassword) {
    throw new Error('Current password and new password are required.');
  }
  const db = readDb();
  const user = (db.users || []).find((u) => u.id === userId);
  if (!user) throw new Error('User not found.');

  let isMatch = false;
  if (user.passwordHash) {
    isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
  } else if (user.password) {
    isMatch = user.password === currentPassword;
  }

  if (!isMatch) {
    throw new Error('Current password is incorrect.');
  }

  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const saltRounds = 10;
  user.passwordHash = bcrypt.hashSync(newPassword, saltRounds);
  delete user.password;

  await safeAtlasCall('update password', () => updateDocInAtlas('users', user.id, user));
  if (!writeDb(db)) throw new Error('Password could not be written to local cache.');

  return { success: true };
}
