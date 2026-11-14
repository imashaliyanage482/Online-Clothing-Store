import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session';
import {
  ensureMongoReady,
  getUserById,
  updateCustomer,
  updateUserPassword,
  getCustomers,
} from '@/lib/db/dataStore';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const tokenUser = await verifySessionToken(token);
    await ensureMongoReady();
    let user = tokenUser?.id ? getUserById(tokenUser.id) : null;

    if (user) {
      // Find matching customer record to include address if present
      const customer = getCustomers().find(
        (c) =>
          c.id === user.id ||
          (user.email && c.email?.toLowerCase() === user.email.toLowerCase())
      );
      if (customer && !user.address && customer.address) {
        user = { ...user, address: customer.address };
      }
    }

    const response = NextResponse.json({ user });

    if (!user) {
      response.cookies.set({
        name: COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
    }

    return response;
  } catch (error) {
    console.error('Failed to retrieve signed-in user:', error);
    return NextResponse.json(
      { error: 'User session could not be verified because the database is unavailable.' },
      { status: 503 }
    );
  }
}

export async function PUT(request) {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const tokenUser = await verifySessionToken(token);
    if (!tokenUser?.id) {
      return NextResponse.json({ error: 'Invalid session token.' }, { status: 401 });
    }

    await ensureMongoReady();
    const body = await request.json();
    const { name, phone, address, currentPassword, newPassword } = body;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Please enter your current password to set a new password.' },
          { status: 400 }
        );
      }
      await updateUserPassword(tokenUser.id, currentPassword, newPassword);
    }

    // Handle profile details update
    if (name || phone !== undefined || address !== undefined) {
      await updateCustomer(tokenUser.id, {
        ...(name ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(address !== undefined ? { address } : {}),
      });
    }

    const updatedUser = getUserById(tokenUser.id);
    if (address !== undefined) {
      updatedUser.address = address;
    }

    return NextResponse.json({
      success: true,
      message: 'Profile and account details updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Failed to update customer profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile.' },
      { status: 400 }
    );
  }
}
