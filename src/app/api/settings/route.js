import { NextResponse } from 'next/server';
import { ensureMongoReady, getSettings, updateSettings } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureMongoReady();
    const settings = getSettings();
    return NextResponse.json(
      { success: true, settings },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to retrieve settings', details: err.message },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}

export async function PUT(request) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const updates = await request.json();
    const enabledCurrencies = updates.enabledCurrencies;
    if (
      !Array.isArray(enabledCurrencies) ||
      enabledCurrencies.length === 0 ||
      enabledCurrencies.some((code) => !['LKR', 'USD'].includes(code))
    ) {
      return NextResponse.json({ error: 'Select at least one supported display currency.' }, { status: 400 });
    }
    if (!enabledCurrencies.includes(updates.currencyCode)) {
      return NextResponse.json({ error: 'The default currency must be enabled.' }, { status: 400 });
    }
    if (!Number.isFinite(Number(updates.lkrPerUsd)) || Number(updates.lkrPerUsd) <= 0) {
      return NextResponse.json({ error: 'The USD exchange rate must be greater than zero.' }, { status: 400 });
    }
    if (
      !Number.isFinite(Number(updates.freeShippingThreshold)) ||
      Number(updates.freeShippingThreshold) < 0 ||
      !Number.isFinite(Number(updates.standardShippingFee)) ||
      Number(updates.standardShippingFee) < 0
    ) {
      return NextResponse.json({ error: 'Shipping values must be valid non-negative amounts.' }, { status: 400 });
    }

    const updated = await updateSettings(updates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update settings', details: err.message }, { status: 500 });
  }
}
