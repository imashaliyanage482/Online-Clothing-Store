'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, RefreshCw } from 'lucide-react';
import EditorialHero from '@/components/shop/EditorialHero';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/collections?active=true')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load collections.');
        }
        setCollections(data.collections || []);
      })
      .catch((fetchError) => {
        console.error('Failed fetching public collections:', fetchError);
        setError('Collections could not be loaded right now. Please try again shortly.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#252525]">
      <EditorialHero
        image="/images/collections-page-hero.png"
        imageAlt="Monochrome couture collection campaign"
        belowImageText="Where Every Collection Finds Its Story."
        showContent={false}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {loading ? (
          <div className="py-16 text-center text-sm text-[#252525]/65">
            <RefreshCw className="mx-auto mb-2 h-5 w-5 animate-spin text-[#B69A7A]" />
            Loading collections…
          </div>
        ) : error ? (
          <p role="alert" className="py-16 text-center text-sm text-red-800">{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] transition-all duration-300 hover:-translate-y-1 hover:border-[#B69A7A] hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EBE3D5]">
                  {collection.image && (
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#252525]/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 font-serif text-xl font-bold text-white">
                    {collection.title}
                  </span>
                </div>
                <div className="flex flex-1 items-end justify-between gap-3 p-5">
                  <p className="text-xs font-light leading-relaxed text-[#252525]/75">
                    {collection.description}
                  </p>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#B69A7A] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
            {!collections.length && !error && (
              <p className="col-span-full py-16 text-center text-sm text-[#252525]/65">
                There are no published collections at the moment.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
