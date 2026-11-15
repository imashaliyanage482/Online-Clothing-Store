import { MongoClient } from 'mongodb';
import dns from 'dns';

// Ensure reliable DNS resolution for MongoDB Atlas SRV and cluster hosts on all networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (_) {}

if (typeof global._mongoDnsPatched === 'undefined') {
  global._mongoDnsPatched = true;
  const originalLookup = dns.lookup;
  dns.lookup = (hostname, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (hostname && typeof hostname === 'string' && hostname.includes('mongodb.net')) {
      dns.resolve4(hostname, (err, addrs) => {
        if (!err && addrs && addrs.length > 0) {
          if (options && options.all) {
            return callback(
              null,
              addrs.map((a) => ({ address: a, family: 4 }))
            );
          }
          return callback(null, addrs[0], 4);
        }
        return originalLookup(hostname, options, callback);
      });
      return;
    }
    return originalLookup(hostname, options, callback);
  };
}


const DB_NAME = 'fashion_store';
const JSON_SEED_MARKER = 'json-seed-v1';
const collections = ['products', 'categories', 'collections', 'orders', 'customers', 'users'];
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 10000,
};

let clientPromise;

const FALLBACK_MONGODB_URI =
  'mongodb+srv://fashionstore_import:fashionstore123@cluster0.mxulgll.mongodb.net/fashion_store?retryWrites=true&w=majority&authSource=admin';

function getNormalizedMongoUri() {
  let uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;
  uri = uri.trim();
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1);
  }
  if (!uri.includes('authSource=')) {
    uri += (uri.includes('?') ? '&' : '?') + 'authSource=admin';
  }
  return uri;
}

function getClientPromise() {
  const uri = getNormalizedMongoUri();

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri, options)
        .connect()
        .catch((error) => {
          global._mongoClientPromise = null;
          throw error;
        });
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri, options).connect().catch((error) => {
      clientPromise = null;
      throw error;
    });
  }
  return clientPromise;
}

export async function getMongoDb() {
  try {
    const client = await getClientPromise();
    return client.db(DB_NAME);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    const unavailable = new Error(`MongoDB is unavailable: ${error.message}`);
    unavailable.name = 'MongoDBUnavailableError';
    throw unavailable;
  }
}

function documentId(document) {
  return document.id || document._id;
}

function withoutMongoId(document) {
  const { _id, ...rest } = document;
  return { ...rest, id: rest.id || _id };
}

export async function seedEmptyCollectionsFromJson(seedData) {
  const db = await getMongoDb();
  const client = await getClientPromise();
  const metadata = db.collection('_app_metadata');
  const session = client.startSession();
  let seeded = false;

  try {
    await session.withTransaction(async () => {
      if (await metadata.findOne({ _id: JSON_SEED_MARKER }, { session })) return;

      for (const name of collections) {
        const target = db.collection(name);
        if (await target.countDocuments({}, { session })) continue;

        const documents = Array.isArray(seedData[name]) ? seedData[name] : [];
        if (!documents.length) continue;

        await target.insertMany(
          documents.map((document) => {
            const id = documentId(document);
            if (!id) throw new Error(`Cannot seed ${name}: a document is missing its id.`);
            const { _id, ...rest } = document;
            return { ...rest, id, _id: id };
          }),
          { ordered: true, session }
        );
      }

      const settings = seedData.settings || {};
      if (
        !(await db.collection('settings').findOne({ _id: 'store-settings' }, { session })) &&
        Object.keys(settings).length
      ) {
        await db.collection('settings').insertOne(
          { ...settings, _id: 'store-settings' },
          { session }
        );
      }

      await metadata.insertOne(
        {
          _id: JSON_SEED_MARKER,
          completedAt: new Date().toISOString(),
        },
        { session }
      );
      seeded = true;
    });
  } finally {
    await session.endSession();
  }
  return seeded;
}

export async function saveDocToAtlas(collectionName, document) {
  const db = await getMongoDb();
  const id = documentId(document);
  if (!id) throw new Error(`Cannot save ${collectionName}: a document id is required.`);

  const { _id, ...rest } = document;
  const result = await db.collection(collectionName).updateOne(
    { $or: [{ id }, { _id: id }] },
    { $set: { ...rest, id }, $setOnInsert: { _id: id } },
    { upsert: true }
  );
  return result.acknowledged;
}

export async function updateDocInAtlas(collectionName, id, updates) {
  const db = await getMongoDb();
  const result = await db.collection(collectionName).updateOne(
    { $or: [{ id }, { _id: id }] },
    { $set: { ...updates, id } }
  );
  if (!result.matchedCount) {
    throw new Error(`Cannot update ${collectionName}: document ${id} was not found in MongoDB.`);
  }
  return true;
}

export async function deleteDocFromAtlas(collectionName, id) {
  const db = await getMongoDb();
  const result = await db.collection(collectionName).deleteOne({
    $or: [{ id }, { _id: id }],
  });
  if (!result.deletedCount) {
    throw new Error(`Cannot delete ${collectionName}: document ${id} was not found in MongoDB.`);
  }
  return true;
}

export async function saveSettingsToAtlas(settings) {
  const db = await getMongoDb();
  const result = await db.collection('settings').updateOne(
    { _id: 'store-settings' },
    { $set: settings },
    { upsert: true }
  );
  return result.acknowledged;
}

export async function persistDocumentsToAtlas({ upserts = [], deletions = [] }) {
  const db = await getMongoDb();
  const client = await getClientPromise();
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      for (const { collectionName, document } of upserts) {
        const id = documentId(document);
        if (!id) throw new Error(`Cannot save ${collectionName}: a document id is required.`);
        const { _id, ...rest } = document;
        await db.collection(collectionName).updateOne(
          { $or: [{ id }, { _id: id }] },
          { $set: { ...rest, id }, $setOnInsert: { _id: id } },
          { upsert: true, session }
        );
      }

      for (const { collectionName, id } of deletions) {
        await db.collection(collectionName).deleteOne(
          { $or: [{ id }, { _id: id }] },
          { session }
        );
      }
    });
  } finally {
    await session.endSession();
  }
}

export async function fetchAllFromAtlas() {
  const db = await getMongoDb();
  const [products, categories, collectionsData, orders, customers, users, settingsDocument] =
    await Promise.all([
      db.collection('products').find({}).toArray(),
      db.collection('categories').find({}).toArray(),
      db.collection('collections').find({}).toArray(),
      db.collection('orders').find({}).toArray(),
      db.collection('customers').find({}).toArray(),
      db.collection('users').find({}).toArray(),
      db.collection('settings').findOne({ _id: 'store-settings' }),
    ]);

  return {
    products: products.map(withoutMongoId),
    categories: categories.map(withoutMongoId),
    collections: collectionsData.map(withoutMongoId),
    orders: orders.map(withoutMongoId),
    customers: customers.map(withoutMongoId),
    users: users.map(withoutMongoId),
    settings: settingsDocument ? withoutMongoId(settingsDocument) : {},
  };
}
