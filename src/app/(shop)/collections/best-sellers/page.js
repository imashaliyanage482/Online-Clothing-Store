'use client';

import React, { useState, useEffect } from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';

export default function BestSellersPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products?bestSellers=true&status=ACTIVE')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ProductListingPage
      heading="Best Sellers"
      subheading="Collections"
      description="Our clients' most celebrated silhouettes — meticulously cut from luxurious silks, merino wools, and organic cottons."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: 'Best Sellers' },
      ]}
      products={products}
    />
  );
}
