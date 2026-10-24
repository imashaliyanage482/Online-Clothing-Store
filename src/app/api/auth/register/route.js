import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // In a live database with Prisma, we would run:
    // const passwordHash = await hashPassword(password);
    // await prisma.user.create({ data: { name, email, passwordHash, role: 'CUSTOMER' } });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please sign in.',
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create customer account.' }, { status: 500 });
  }
}
