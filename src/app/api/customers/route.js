import { NextResponse } from 'next/server';
import {
  ensureMongoReady,
  getCustomerDeletionCandidate,
  getCustomers,
  getOrders,
} from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(request.url);
    const forceSync = searchParams.get('sync') === 'true';
    await ensureMongoReady(forceSync || true);
    const identifier = searchParams.get('q');
    if (identifier === null) {
      const ordersByEmail = new Map();
      for (const order of getOrders()) {
        const email = order.customerEmail?.trim().toLowerCase();
        if (!email) continue;
        const totals = ordersByEmail.get(email) || { count: 0, spent: 0 };
        totals.count += 1;
        totals.spent += Number(order.totalAmount) || 0;
        ordersByEmail.set(email, totals);
      }

      const customers = getCustomers()
        .filter((customer) => customer.role !== 'ADMIN')
        .map((customer) => {
          const totals = ordersByEmail.get(customer.email?.trim().toLowerCase()) || {
            count: 0,
            spent: 0,
          };
          return {
            id: customer.id,
            name: customer.name || 'Customer',
            email: customer.email || '',
            phone: customer.phone || '',
            totalOrders: totals.count,
            totalSpent: totals.spent,
            createdAt: customer.createdAt || null,
            anonymizedAt: customer.anonymizedAt || null,
          };
        });

      return NextResponse.json({ success: true, count: customers.length, customers });
    }

    if (!identifier.trim() || identifier.trim().length > 254) {
      return NextResponse.json(
        { error: 'Search using an exact customer email or customer ID.' },
        { status: 400 }
      );
    }

    const customer = getCustomerDeletionCandidate(identifier);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, customer });
  } catch (err) {
    console.error('Failed to search for customer account:', err);
    return NextResponse.json({ error: 'Failed to search for customer account.' }, { status: 500 });
  }
}
