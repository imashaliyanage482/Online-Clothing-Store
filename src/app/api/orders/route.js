import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureMongoReady, getOrders, createOrder } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceSync = searchParams.get('sync') === 'true';
    await ensureMongoReady(forceSync);

    // Check Admin authorization first
    const adminAuth = await checkAdminAuth(request);
    if (adminAuth.authorized) {
      const orders = getOrders().map((order) => {
        const safeOrder = { ...order };
        delete safeOrder.receiptToken;
        return safeOrder;
      });
      return NextResponse.json({ success: true, count: orders.length, orders });
    }

    // If not admin, check customer session
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      const tokenUser = await verifySessionToken(token);
      if (tokenUser?.email) {
        const userEmail = tokenUser.email.trim().toLowerCase();
        const userId = tokenUser.id;

        const customerOrders = getOrders()
          .filter(
            (o) =>
              (o.customerEmail && o.customerEmail.trim().toLowerCase() === userEmail) ||
              (userId && o.customerId === userId)
          )
          .map((order) => {
            const safeOrder = { ...order };
            delete safeOrder.receiptToken;
            return safeOrder;
          });

        return NextResponse.json({
          success: true,
          count: customerOrders.length,
          orders: customerOrders,
        });
      }
    }

    return unauthorizedResponse(adminAuth.error || 'Authentication required');
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to retrieve orders', details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await ensureMongoReady();
    const body = await request.json();
    if (!body.items || !body.items.length) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    const created = await createOrder(body);
    const { receiptToken, ...order } = created;
    return NextResponse.json({ success: true, order, receiptToken }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to create order' },
      { status: err.status || 500 }
    );
  }
}
