'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { defaultMenProducts } from '@/data/catalogDefaults';

export default function MenOuterwearPage() {
  return (
    <ProductListingPage
      heading="Jackets & Outerwear"
      subheading="Men"
      categorySlug="outerwear"
      gender="men"
      description="Minimalist double-faced wool overcoats, 450gsm dense loopback French terry hoodies, and waxed field jackets."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men' },
        { label: 'Jackets & Outerwear' },
      ]}
      products={[]}
    />
  );
}
