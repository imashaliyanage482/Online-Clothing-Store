import { verifySessionToken, COOKIE_NAME } from './session';
import { NextResponse } from 'next/server';

export async function checkAdminAuth(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return { authorized: false, error: 'Unauthorized: Session missing' };
  }

  const user = await verifySessionToken(token);
  if (!user || user.role !== 'ADMIN') {
    return { authorized: false, error: 'Forbidden: Admin access required' };
  }

  return { authorized: true, user };
}

export function unauthorizedResponse(error = 'Forbidden') {
  return NextResponse.json({ error }, { status: 403 });
}
