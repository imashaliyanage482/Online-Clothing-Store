import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from './session';
import { ROLES } from '../constants/roles';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== ROLES.ADMIN) {
    throw new Error('FORBIDDEN');
  }
  return user;
}
