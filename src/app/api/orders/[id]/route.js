import { NextResponse } from 'next/server';
import { ensureMongoReady, getOrderById, updateOrder, deleteOrder } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const { id } = params;
    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const safeOrder = { ...order };
    delete safeOrder.receiptToken;
    return NextResponse.json({ success: true, order: safeOrder });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve order', details: err.message }, { status: 500 });
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

    const updated = await updateOrder(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found for update' }, { status: 404 });
    }

    const safeOrder = { ...updated };
    delete safeOrder.receiptToken;
    return NextResponse.json({ success: true, order: safeOrder });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order', details: err.message }, { status: 500 });
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
    const success = await deleteOrder(id);
    if (!success) {
      return NextResponse.json({ error: 'Order not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order successfully deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete order', details: err.message }, { status: 500 });
  }
}
