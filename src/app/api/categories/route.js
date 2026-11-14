import { NextResponse } from 'next/server';
import { ensureMongoReady, getCategories, createCategory } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';

export async function GET(request) {
  try {
    await ensureMongoReady();
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const categories = getCategories({ gender });
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve categories', details: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const created = await createCategory(body);
    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create category', details: err.message }, { status: 500 });
  }
}
