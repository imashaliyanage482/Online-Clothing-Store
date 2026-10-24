import React from 'react';
import ProductCard from '@/components/shop/ProductCard';

export const metadata = {
  title: 'All Apparel Collections',
  description: 'Browse the complete range of clothing, accessories, and seasonal footwear.',
};

const productsList = [
  {
    id: 'p1',
    title: 'Merino Wool Minimalist Trench Coat',
    slug: 'merino-wool-minimalist-trench-coat',
    basePrice: 285.00,
    category: { name: "Women's Collection" },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v1', size: 'M', colorName: 'Camel', additionalPrice: 0 }],
  },
  {
    id: 'p2',
    title: 'Relaxed Fit Heavyweight Cotton Overshirt',
    slug: 'relaxed-fit-heavyweight-cotton-overshirt',
    basePrice: 120.00,
    category: { name: "Men's Collection" },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v2', size: 'L', colorName: 'Olive Green', additionalPrice: 0 }],
  },
  {
    id: 'p3',
    title: 'Structured Ribbed Knit Turtleneck',
    slug: 'structured-ribbed-knit-turtleneck',
    basePrice: 95.00,
    category: { name: "Women's Collection" },
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v3', size: 'S', colorName: 'Ivory', additionalPrice: 0 }],
  },
  {
    id: 'p4',
    title: 'Italian Pebble Leather Weekend Tote',
    slug: 'italian-pebble-leather-weekend-tote',
    basePrice: 340.00,
    category: { name: 'Accessories' },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v4', size: 'One Size', colorName: 'Espresso', additionalPrice: 0 }],
  },
];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Apparel</h1>
        <p className="mt-2 text-sm text-slate-500">
          Curated staples crafted for durability, comfort, and timeless fashion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
