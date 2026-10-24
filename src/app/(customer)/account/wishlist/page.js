'use client';

import React from 'react';
import CustomerHeader from '@/components/customer/CustomerHeader';
import ProductCard from '@/components/shop/ProductCard';

const wishlistProducts = [
  {
    id: 'p1',
    title: 'Merino Wool Minimalist Trench Coat',
    slug: 'merino-wool-minimalist-trench-coat',
    basePrice: 285.00,
    category: { name: "Women's Collection" },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v1', size: 'M', colorName: 'Camel' }],
  },
  {
    id: 'p4',
    title: 'Italian Pebble Leather Weekend Tote',
    slug: 'italian-pebble-leather-weekend-tote',
    basePrice: 340.00,
    category: { name: 'Accessories' },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v4', size: 'One Size', colorName: 'Espresso' }],
  },
];

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <CustomerHeader
        title="Saved Wishlist"
        subtitle="Items saved for future acquisition or seasonal style matching."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
