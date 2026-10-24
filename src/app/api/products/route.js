import { NextResponse } from 'next/server';

const mockProducts = [
  {
    id: 'p1',
    title: 'Merino Wool Minimalist Trench Coat',
    slug: 'merino-wool-minimalist-trench-coat',
    basePrice: 285.00,
    category: { name: "Women's Collection", slug: 'womens-collection' },
    isFeatured: true,
  },
  {
    id: 'p2',
    title: 'Relaxed Fit Heavyweight Cotton Overshirt',
    slug: 'relaxed-fit-heavyweight-cotton-overshirt',
    basePrice: 120.00,
    category: { name: "Men's Collection", slug: 'mens-collection' },
    isFeatured: true,
  },
];

export async function GET() {
  return NextResponse.json({ products: mockProducts });
}
