import { NextResponse } from 'next/server';
import { ensureMongoReady, getInventory, updateStock } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';

export async function GET(request) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const inventory = getInventory();
    return NextResponse.json({ success: true, count: inventory.length, inventory });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve inventory', details: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const { id, stockQuantity } = await request.json();
    if (!id || stockQuantity === undefined) {
      return NextResponse.json({ error: 'Product ID and stockQuantity are required' }, { status: 400 });
    }

    const updated = await updateStock(id, stockQuantity);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found in inventory' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update stock', details: err.message }, { status: 500 });
  }
}
