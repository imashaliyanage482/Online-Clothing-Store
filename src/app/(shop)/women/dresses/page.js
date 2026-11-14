'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { womenProducts } from '@/data/womenProducts';

export default function WomenDressesPage() {
  return (
    <ProductListingPage
      heading="Dresses"
      subheading="Women"
      categorySlug="dresses"
      gender="women"
      description="From casual summer linen wrap dresses to floor-sweeping pleated accordion maxi gowns and lustrous cowl-neck slips."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Women', href: '/women' },
        { label: 'Dresses' },
      ]}
      products={[]}
    />
  );
}
