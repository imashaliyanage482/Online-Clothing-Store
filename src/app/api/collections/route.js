import { NextResponse } from 'next/server';
import { ensureMongoReady, getCollections, createCollection } from '@/lib/db/dataStore';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';

export async function GET(request) {
  try {
    await ensureMongoReady();
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('active') === 'true' ? true : undefined;
    const collections = getCollections({ isActive });
    return NextResponse.json({ success: true, count: collections.length, collections });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve collections', details: err.message }, { status: 500 });
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
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ error: 'Collection title is required' }, { status: 400 });
    }

    const slugSource = typeof body.slug === 'string' && body.slug.trim()
      ? body.slug
      : body.title;
    const slug = slugSource.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) {
      return NextResponse.json({ error: 'A valid collection title is required' }, { status: 400 });
    }
    if (['evening-wear', 'new-arrivals', 'summer', 'essentials', 'best-sellers'].includes(slug)) {
      return NextResponse.json({ error: 'This URL slug is reserved for an existing collection.' }, { status: 409 });
    }
    if (getCollections().some((collection) => collection.slug === slug)) {
      return NextResponse.json({ error: 'A collection with this URL slug already exists' }, { status: 409 });
    }

    const created = await createCollection({ ...body, title: body.title.trim(), slug });
    return NextResponse.json({ success: true, collection: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create collection', details: err.message }, { status: 500 });
  }
}
