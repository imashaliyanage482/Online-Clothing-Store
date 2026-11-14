'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { womenProducts } from '@/data/womenProducts';

export default function WomenDenimPage() {
  return (
    <ProductListingPage
      heading="Trousers & Jeans"
      subheading="Women"
      categorySlug="jeans"
      gender="women"
      description="Vintage-washed oversized trucker jackets, relaxed boyfriend silhouettes, tailored denim blazers, and classic indigo staples."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Women', href: '/women' },
        { label: 'Trousers & Jeans' },
      ]}
      products={[]}
    />
  );
}
