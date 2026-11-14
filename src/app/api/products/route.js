import { NextResponse } from 'next/server';
import { ensureMongoReady, getOrders, getProducts, createProduct } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';
import { validateProductInput } from '@/lib/db/productValidation';

export async function GET(request) {
  try {
    await ensureMongoReady();
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const categorySlug = searchParams.get('category');
    const collectionSlug = searchParams.get('collection');
    const isSale = searchParams.get('sale') === 'true' ? true : undefined;
    const isNew = searchParams.get('new') === 'true' ? true : undefined;
    const bestSellers = searchParams.get('bestSellers') === 'true';
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('q') || searchParams.get('search');

    let products = getProducts({
      gender,
      categorySlug,
      collectionSlug,
      isSale,
      isNew,
      status,
      search,
    });

    if (bestSellers) {
      const orders = getOrders();

      const getOrderCountForProduct = (product) => {
        let count = 0;
        orders.forEach((order) => {
          (order.items || []).forEach((item) => {
            const qty = Number(item.quantity) || 1;
            const matchesId = item.productId === product.id;
            const matchesSlug = item.productId === product.slug || item.slug === product.slug;
            const matchesPrefix = item.productId && (item.productId.startsWith(`${product.id}-`) || item.productId.startsWith(`${product.slug}-`));
            const matchesTitle = item.productTitle && product.title && item.productTitle.trim().toLowerCase() === product.title.trim().toLowerCase();

            if (matchesId || matchesSlug || matchesPrefix || matchesTitle) {
              count += qty;
            }
          });
        });
        return count;
      };

      const ranked = products
        .map((product, index) => ({
          product,
          index,
          quantity: getOrderCountForProduct(product),
        }))
        .filter((entry) => entry.quantity > 0)
        .sort((a, b) => b.quantity - a.quantity || a.index - b.index)
        .map((entry) => ({
          ...entry.product,
          soldCount: entry.quantity,
          isBestSeller: true,
        }));

      products = ranked;
    }

    return NextResponse.json(
      { success: true, count: products.length, products },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve products', details: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const body = await request.json();
    const validationError = validateProductInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const created = await createProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create product', details: err.message }, { status: 500 });
  }
}
