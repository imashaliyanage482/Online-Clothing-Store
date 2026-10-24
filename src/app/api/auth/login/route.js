import { NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth/session';

// Mock credentials fallback for instant testability without active DB connection
const DEMO_ACCOUNTS = [
  {
    email: 'admin@fashionstore.com',
    password: 'Admin@FashionStore2026',
    user: { id: 'usr-admin', email: 'admin@fashionstore.com', name: 'System Administrator', role: 'ADMIN' },
  },
  {
    email: 'customer@example.com',
    password: 'Customer@123456',
    user: { id: 'usr-customer', email: 'customer@example.com', name: 'Jane Doe', role: 'CUSTOMER' },
  },
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const match = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (!match) {
      return NextResponse.json({ error: 'Invalid email address or password.' }, { status: 401 });
    }

    const token = await createSessionToken(match.user);

    const response = NextResponse.json({ success: true, user: match.user });
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
    return NextResponse.json({ error: 'Server authentication error.' }, { status: 500 });
  }
}
