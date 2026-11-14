'use client';

import React from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';
import { womenProducts } from '@/data/womenProducts';

export default function WomenTopsPage() {
  return (
    <ProductListingPage
      heading="Tops & Blouses"
      subheading="Women"
      categorySlug="tops"
      gender="women"
      description="Effortless everyday basics, breathable pure French linen resort shirts, and fluid mulberry silk blouses tailored with quiet elegance."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Women', href: '/women' },
        { label: 'Tops & Blouses' },
      ]}
      products={[]}
    />
  );
}
