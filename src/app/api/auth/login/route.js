import { NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { ensureMongoReady, verifyUserPassword } from '@/lib/db/dataStore';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    try {
      await ensureMongoReady();
    } catch (e) {
      console.warn('MongoDB non-blocking warning during login:', e.message);
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    let user = verifyUserPassword(email, password);
    if (!user) {
      try {
        await ensureMongoReady(true);
        user = verifyUserPassword(email, password);
      } catch (_) {}
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email address or password.' }, { status: 401 });
    }

    const token = await createSessionToken(user);

    const response = NextResponse.json({ success: true, user });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error('Authentication failed:', err);
    return NextResponse.json(
      { error: 'Server authentication error.' },
      { status: 500 }
    );
  }
}
