'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { defaultMenProducts } from '@/data/catalogDefaults';

export default function MenDenimPage() {
  return (
    <ProductListingPage
      heading="Denim"
      subheading="Men"
      categorySlug="jeans"
      gender="men"
      description="Classic selvedge cuts, vintage washes, and heavy organic cotton trucker denim built to last."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men' },
        { label: 'Denim' },
      ]}
      products={[]}
    />
  );
}
