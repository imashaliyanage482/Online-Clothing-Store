import { NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth/adminGuard';
import { ensureMongoReady, anonymizeCustomerAccount, updateCustomer, deleteCustomer } from '@/lib/db/dataStore';

export async function PUT(request, { params }) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();
    const body = await request.json();
    const updated = await updateCustomer(params.id, body);

    return NextResponse.json({
      success: true,
      message: 'Customer details updated successfully.',
      customer: updated,
    });
  } catch (err) {
    console.error('Failed to update customer account:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update customer account.' },
      { status: err.message === 'Customer not found.' ? 404 : 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    await ensureMongoReady();

    let confirmationEmail = null;
    try {
      const body = await request.json();
      confirmationEmail = body?.confirmationEmail;
    } catch {
      // Body may be empty if simple DELETE request
    }

    if (confirmationEmail) {
      const result = await anonymizeCustomerAccount(params.id, confirmationEmail);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }

      return NextResponse.json({
        success: true,
        message: 'Customer login disabled and personal details anonymized.',
        orderCount: result.orderCount,
      });
    }

    // Direct deletion
    await deleteCustomer(params.id);

    return NextResponse.json({
      success: true,
      message: 'Customer account deleted successfully.',
    });
  } catch (err) {
    console.error('Failed to delete customer account:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to delete customer account.' },
      { status: err.message === 'Customer not found.' ? 404 : 500 }
    );
  }
}
