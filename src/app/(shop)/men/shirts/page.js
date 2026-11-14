'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { defaultMenProducts } from '@/data/catalogDefaults';

export default function MenShirtsPage() {
  return (
    <ProductListingPage
      heading="T-Shirts & Shirts"
      subheading="Men"
      categorySlug="shirts"
      gender="men"
      description="Crisp Oxford button-downs, breathable French linen resort shirts, and heavyweight Supima cotton tees."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men' },
        { label: 'T-Shirts & Shirts' },
      ]}
      products={[]}
    />
  );
}
