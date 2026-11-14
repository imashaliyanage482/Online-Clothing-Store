'use client';

import React, { useState, useEffect } from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products?new=true&status=ACTIVE')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.products || []);
      })
      .catch((error) => console.error('Failed to load New Arrivals:', error));
  }, []);

  return (
    <ProductListingPage
      heading="New Arrivals"
      subheading="Collections"
      description="The latest drops and runway additions — discover fresh atelier silhouettes tailored in pure natural fibers."
      heroImage="/images/new-arrivals-page-hero.png"
      belowImageText="A Fresh Chapter in Your Style Story."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: 'New Arrivals' },
      ]}
      products={products}
      showHeroCopy={false}
    />
  );
}
