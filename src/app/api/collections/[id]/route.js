import { NextResponse } from 'next/server';
import { ensureMongoReady, updateCollection, deleteCollection } from '@/lib/db/dataStore';
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
    const updated = await updateCollection(id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, collection: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update collection', details: err.message }, { status: 500 });
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
    const ok = await deleteCollection(id);

    if (!ok) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Collection deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete collection', details: err.message }, { status: 500 });
  }
}
