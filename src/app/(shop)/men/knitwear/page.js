'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { defaultMenProducts } from '@/data/catalogDefaults';

export default function MenKnitwearPage() {
  return (
    <ProductListingPage
      heading="Jackets & Outerwear"
      subheading="Men"
      categorySlug="outerwear"
      gender="men"
      description="Grade-A Mongolian white cashmere crewnecks, chunky wool cable-knit fisherman sweaters, and fine merino mock necks."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men' },
        { label: 'Jackets & Outerwear' },
      ]}
      products={[]}
    />
  );
}
