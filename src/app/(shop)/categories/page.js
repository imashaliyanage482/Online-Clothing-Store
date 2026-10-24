import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Clothing Collections & Categories',
  description: 'Shop by category across womenswear, menswear, and accessories.',
};

const categories = [
  {
    name: "Women's Collection",
    slug: 'womens-collection',
    count: '34 items',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: "Men's Collection",
    slug: 'mens-collection',
    count: '28 items',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: '19 items',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
];

export default function CategoriesIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Apparel Categories</h1>
        <p className="mt-2 text-sm text-slate-500">
          Browse our collections tailored by silhouette and lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group relative h-96 rounded-2xl overflow-hidden bg-slate-100 shadow-sm"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent p-6 flex flex-col justify-end">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">{cat.count}</span>
              <h3 className="text-2xl font-bold text-white mt-1">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
