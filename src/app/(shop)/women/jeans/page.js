'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { womenProducts } from '@/data/womenProducts';

export default function WomenJeansPage() {
  return (
    <ProductListingPage
      heading="Trousers & Jeans"
      subheading="Women"
      categorySlug="jeans"
      gender="women"
      description="Tailored pleated high-waisted trousers, breezy pure linen palazzos, vintage straight-leg jeans, and modern wide-leg cuts."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Women', href: '/women' },
        { label: 'Trousers & Jeans' },
      ]}
      products={[]}
    />
  );
}
