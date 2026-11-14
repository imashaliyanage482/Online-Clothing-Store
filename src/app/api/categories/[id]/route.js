import { NextResponse } from 'next/server';
import { ensureMongoReady, updateCategory, deleteCategory } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';

export async function PUT(request, { params }) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const { id } = params;
    const updates = await request.json();
    const updated = await updateCategory(id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update category', details: err.message }, { status: 500 });
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
    const ok = await deleteCategory(id);

    if (!ok) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete category', details: err.message }, { status: 500 });
  }
}
