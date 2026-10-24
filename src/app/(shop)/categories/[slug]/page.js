import React from 'react';
import ProductCard from '@/components/shop/ProductCard';

const sampleProducts = [
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
    id: 'p3',
    title: 'Structured Ribbed Knit Turtleneck',
    slug: 'structured-ribbed-knit-turtleneck',
    basePrice: 95.00,
    category: { name: "Women's Collection" },
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v3', size: 'S', colorName: 'Ivory', additionalPrice: 0 }],
  },
];

export default function CategoryDetailPage({ params }) {
  const categoryName = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{categoryName}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Showing apparel curated for {categoryName}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
