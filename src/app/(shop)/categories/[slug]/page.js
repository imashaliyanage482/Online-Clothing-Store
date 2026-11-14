import React from 'react';
import ProductCard from '@/components/shop/ProductCard';
import EditorialHero from '@/components/shop/EditorialHero';

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
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <EditorialHero
        image="/images/hero-editorial-2.jpg"
        imageAlt={`${categoryName} apparel`}
        eyebrow="CURATED CATEGORY"
        heading={categoryName}
        description={`Showing apparel thoughtfully designed and curated for ${categoryName}.`}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
