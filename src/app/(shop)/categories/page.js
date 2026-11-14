'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EditorialHero from '@/components/shop/EditorialHero';

const defaultCategories = [
  {
    name: "Women's Collection",
    slug: 'womens-collection',
    count: 'Curated Edit',
    href: '/women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: "Men's Collection",
    slug: 'mens-collection',
    count: 'Curated Edit',
    href: '/men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: 'Curated Edit',
    href: '/women/accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
];

export default function CategoriesIndexPage() {
  const [categoryList, setCategoryList] = useState(defaultCategories);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories?.length) {
          const mapped = data.categories
            .filter((c) => c.isActive !== false)
            .map((c) => ({
              name: c.title,
              slug: c.slug,
              count: c.itemCount || `${c.gender === 'women' ? "Women's" : "Men's"} Edit`,
              href: c.href || `/${c.gender || 'women'}/${c.slug}`,
              image: c.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
            }));
          if (mapped.length > 0) {
            setCategoryList(mapped);
          }
        }
      })
      .catch((err) => console.error('Failed fetching categories for index page:', err));
  }, []);

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <EditorialHero
        image="/images/home-category-collection.jpg"
        imageAlt="Curated apparel categories"
        eyebrow="THE ATELIER ARCHIVE"
        heading="Apparel Categories"
        description="Browse our collections tailored by silhouette and lifestyle."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {categoryList.map((cat, idx) => (
            <Link
              key={cat.slug + idx}
              href={cat.href || `/categories/${cat.slug}`}
              className="group relative h-96 overflow-hidden rounded-2xl border border-[#B69A7A]/30 bg-[#EBE3D5] shadow-sm"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252525]/85 via-[#252525]/25 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-[#F5F0E8] sm:p-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B69A7A]">
                  {cat.count}
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#F5F0E8]">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
