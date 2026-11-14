import { NextResponse } from 'next/server';
import { ensureMongoReady, getOrderById } from '@/lib/db/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await ensureMongoReady();
    const order = getOrderById(params.id);
    const receiptToken = new URL(request.url).searchParams.get('key');

    if (!order || !receiptToken || order.receiptToken !== receiptToken) {
      return NextResponse.json({ error: 'Receipt not found.' }, { status: 404 });
    }

    const { receiptToken: _receiptToken, ...receipt } = order;
    return NextResponse.json({ success: true, order: receipt });
  } catch (error) {
    console.error('Failed to retrieve order receipt:', error);
    return NextResponse.json(
      { error: 'The order receipt could not be retrieved.' },
      { status: 500 }
    );
  }
}
