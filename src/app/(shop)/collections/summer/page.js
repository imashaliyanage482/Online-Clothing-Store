'use client';

import React, { useState, useEffect } from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';

export default function SummerCollectionPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products?collection=summer')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products?.length) {
          setProducts(data.products);
        } else {
          fetch('/api/products')
            .then((r) => r.json())
            .then((d) => setProducts(d.products?.slice(6, 18) || []));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ProductListingPage
      heading="Summer Collection"
      subheading="Collections"
      description="Lightweight resort wear, Normandy flax linens, breathable cottons, and sun-kissed natural tones tailored for coastal elegance."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: 'Summer Collection' },
      ]}
      products={products}
    />
  );
}
