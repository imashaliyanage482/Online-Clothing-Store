'use client';

import React, { useState, useEffect } from 'react';
import ProductListingPage from '@/components/shop/ProductListingPage';

export default function SalePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products?sale=true&status=ACTIVE')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((error) => console.error('Failed to load Sale products:', error));
  }, []);

  return (
    <ProductListingPage
      heading="The Seasonal Archive Sale"
      subheading="Exclusive Markdowns"
      description="Refined wardrobe pieces, now available at special seasonal pricing. Discover timeless outerwear, knits, dresses, and silk essentials in limited quantities."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'SALE' },
      ]}
      products={products}
      isSale={true}
      heroImage="/images/sale-hero.png"
      belowImageText="Your Next Favourite, at a Better Price."
      showHeroCopy={false}
    />
  );
}
