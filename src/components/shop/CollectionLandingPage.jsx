'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import EditorialHero from '@/components/shop/EditorialHero';

export default function CollectionLandingPage({ slug }) {
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch('/api/collections?active=true').then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load collection details.');
        }
        return data.collections?.find((item) => item.slug === slug) || null;
      }),
      fetch(`/api/products?collection=${encodeURIComponent(slug)}&status=ACTIVE`).then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load collection products.');
        }
        return data.products || [];
      }),
    ])
      .then(([foundCollection, collectionProducts]) => {
        if (!active) return;
        setCollection(foundCollection);
        setProducts(collectionProducts);
      })
      .catch((fetchError) => {
        if (!active) return;
        console.error(`Failed loading collection "${slug}":`, fetchError);
        setError('This collection could not be loaded right now. Please try again shortly.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#F5F0E8] text-sm text-[#252525]/65">
        <RefreshCw className="mr-2 h-5 w-5 animate-spin text-[#B69A7A]" />
        Loading collection…
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-[#F5F0E8] px-4 text-center">
        <p role={error ? 'alert' : 'status'} className="text-sm text-[#252525]/70">
          {error || 'This collection is not currently available.'}
        </p>
        <Link href="/collections" className="text-xs font-semibold uppercase tracking-wider text-[#B69A7A] hover:text-[#252525]">
          Browse all collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#252525]">
      <EditorialHero
        image={collection.image || '/images/home-category-collection.jpg'}
        imageAlt={`${collection.title} collection`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: collection.title },
        ]}
        eyebrow="THE COLLECTION"
        heading={collection.title}
        description={collection.description}
        imageClassName="object-cover object-top"
        unoptimized={Boolean(collection.image)}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {products.length ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-[#252525]/65">
            New styles for this collection are coming soon.
          </p>
        )}
      </section>
    </div>
  );
}
