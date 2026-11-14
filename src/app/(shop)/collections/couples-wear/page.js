'use client';

import React, { useState, useEffect } from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';

export default function CouplesWearPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products?collection=couples-wear&status=ACTIVE')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products?.length) {
          setProducts(data.products);
        } else {
          fetch('/api/products?search=couple&status=ACTIVE')
            .then((r) => r.json())
            .then((d) => setProducts(d.products || []));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ProductListingPage
      heading="Couples Wear"
      subheading="Collections"
      heroImage="/images/products/img_d1685bdda662.jpg"
      description="Coordinated luxury silhouettes and matching capsule edits designed for modern couples."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: 'Couples Wear' },
      ]}
      products={products}
    />
  );
}
