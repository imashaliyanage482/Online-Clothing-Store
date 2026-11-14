'use client';

import React, { useState, useEffect } from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';

export default function EveningWearCollectionPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products?collection=evening-wear')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products?.length) {
          setProducts(data.products);
        } else {
          fetch('/api/products')
            .then((r) => r.json())
            .then((d) => setProducts(d.products?.slice(15, 27) || []));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ProductListingPage
      heading="Evening Wear & Atelier"
      subheading="Collections"
      description="Lustrous mulberry silk slip gowns, hand-tailored tuxedo outerwear, and handcrafted jewelry designed for celebratory evenings."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: 'Evening Wear & Atelier' },
      ]}
      products={products}
    />
  );
}
