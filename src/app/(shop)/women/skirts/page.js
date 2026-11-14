'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { womenProducts } from '@/data/womenProducts';

export default function WomenSkirtsPage() {
  return (
    <ProductListingPage
      heading="Skirts"
      subheading="Women"
      categorySlug="skirts"
      gender="women"
      description="Bias-cut silk satin midi skirts, sharp pleated accordion silhouettes, raw hem denim skirts, and airy tiered summer maxis."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Women', href: '/women' },
        { label: 'Skirts' },
      ]}
      products={[]}
    />
  );
}
