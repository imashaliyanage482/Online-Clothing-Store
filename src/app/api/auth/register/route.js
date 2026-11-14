import { NextResponse } from 'next/server';
import { createUser, ensureMongoReady } from '@/lib/db/dataStore';

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    await ensureMongoReady();
    const user = await createUser({ name, email, password, phone });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please sign in.',
      user,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to create customer account.' },
      { status: err.name === 'MongoDBUnavailableError' ? 503 : 400 }
    );
  }
}
