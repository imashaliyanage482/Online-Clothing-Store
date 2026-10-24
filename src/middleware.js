import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'fashionstore-super-secure-production-jwt-secret-key-32chars';
const SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = 'fashionstore_session';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let user = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      user = payload;
    } catch (err) {
      // Invalid/expired token
    }
  }

  // 1. Guard Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!user || user.role !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard Customer Account & Checkout Routes
  if (pathname.startsWith('/account') || pathname === '/checkout') {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Prevent logged-in users from visiting login or register again
  if (user && (pathname === '/login' || pathname === '/register')) {
    if (user.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout', '/login', '/register'],
};
