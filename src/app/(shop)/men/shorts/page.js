'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { defaultMenProducts } from '@/data/catalogDefaults';

export default function MenShortsPage() {
  return (
    <ProductListingPage
      heading="Shorts & Resort Bottoms"
      subheading="Men"
      categorySlug="jeans"
      gender="men"
      description="Airy linen drawstring resort shorts, tailored chino shorts, and heavyweight loopback fleece weekend shorts."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men' },
        { label: 'Shorts' },
      ]}
      products={[]}
    />
  );
}
