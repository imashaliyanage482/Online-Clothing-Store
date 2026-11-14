'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { defaultMenProducts } from '@/data/catalogDefaults';

export default function MenTrousersPage() {
  return (
    <ProductListingPage
      heading="Trousers & Jeans"
      subheading="Men"
      categorySlug="jeans"
      gender="men"
      description="Single-pleated tailored trousers, garment-dyed stretch cotton chinos, and relaxed drawstring linen trousers."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men' },
        { label: 'Trousers & Jeans' },
      ]}
      products={[]}
    />
  );
}
