import { NextResponse } from 'next/server';
import {
  ensureMongoReady,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';
import { validateProductInput } from '@/lib/db/productValidation';

export async function GET(request, { params }) {
  try {
    await ensureMongoReady();
    const { id } = params;
    let product = getProductById(id);
    if (!product) {
      product = getProductBySlug(id);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, product },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve product', details: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const { id } = params;
    const updates = await request.json();
    const currentProduct = getProductById(id);
    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found for update' }, { status: 404 });
    }

    const validationError = validateProductInput({ ...currentProduct, ...updates });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updated = await updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found for update' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update product', details: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const { id } = params;
    const ok = await deleteProduct(id);
    if (!ok) {
      return NextResponse.json({ error: 'Product not found for deletion' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete product', details: err.message }, { status: 500 });
  }
}
