import { NextResponse } from 'next/server';

const mockCategories = [
  { id: 'c1', name: "Women's Collection", slug: 'womens-collection' },
  { id: 'c2', name: "Men's Collection", slug: 'mens-collection' },
  { id: 'c3', name: 'Accessories', slug: 'accessories' },
];

export async function GET() {
  return NextResponse.json({ categories: mockCategories });
}
