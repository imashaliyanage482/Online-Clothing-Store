import { NextResponse } from 'next/server';
import { ensureMongoReady, getAdminStats } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';

export async function GET(request) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const period = new URL(request.url).searchParams.get('period') || '30d';
    const stats = getAdminStats(period);
    return NextResponse.json({ success: true, stats });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve admin stats', details: err.message }, { status: 500 });
  }
}
