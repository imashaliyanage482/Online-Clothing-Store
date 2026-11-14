'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { defaultMenProducts } from '@/data/catalogDefaults';

export default function MenAccessoriesPage() {
  return (
    <ProductListingPage
      heading="Accessories"
      subheading="Men"
      categorySlug="accessories"
      gender="men"
      description="Full-grain bridle leather belts, RFID minimalist calfskin wallets, polarized acetate aviators, and weekend duffles."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men' },
        { label: 'Accessories' },
      ]}
      products={[]}
    />
  );
}
