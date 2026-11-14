'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { womenProducts } from '@/data/womenProducts';

export default function WomenAccessoriesPage() {
  return (
    <ProductListingPage
      heading="Accessories"
      subheading="Women"
      categorySlug="accessories"
      gender="women"
      description="Handcrafted Italian leather shoulder bags, artisanal brass-buckle belts, hand-rolled mulberry silk scarves, and UV400 acetate eyewear."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Women', href: '/women' },
        { label: 'Accessories' },
      ]}
      products={[]}
    />
  );
}
