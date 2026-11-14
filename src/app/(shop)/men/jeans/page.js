'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { defaultMenProducts } from '@/data/catalogDefaults';

export default function MenJeansPage() {
  return (
    <ProductListingPage
      heading="Trousers & Jeans"
      subheading="Men"
      categorySlug="jeans"
      gender="men"
      description="14oz Japanese selvedge denim, relaxed vintage washed tapered fits, and enduring indigo classics."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men' },
        { label: 'Trousers & Jeans' },
      ]}
      products={[]}
    />
  );
}
