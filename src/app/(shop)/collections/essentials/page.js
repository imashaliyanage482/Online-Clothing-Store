'use client';

import React, { useState, useEffect } from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';

export default function EssentialsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products?collection=essentials')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products?.length) {
          setProducts(data.products);
        } else {
          fetch('/api/products')
            .then((r) => r.json())
            .then((d) => setProducts(d.products?.slice(0, 12) || []));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ProductListingPage
      heading="Everyday Essentials"
      subheading="Collections"
      description="Timeless foundation wardrobe pieces engineered for daily comfort, longevity, and effortless sophistication."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: 'Everyday Essentials' },
      ]}
      products={products}
    />
  );
}
