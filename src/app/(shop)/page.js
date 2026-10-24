import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/shop/ProductCard';

export const metadata = {
  title: 'FashionStore | Luxury Apparel & Seasonal Essentials',
  description: 'Explore the latest sustainable clothing collections, timeless silhouettes, and seasonal essentials.',
};

// Demo apparel items for immediate visual fidelity
const sampleProducts = [
  {
    id: 'p1',
    title: 'Merino Wool Minimalist Trench Coat',
    slug: 'merino-wool-minimalist-trench-coat',
    basePrice: 285.00,
    category: { name: "Women's Collection" },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v1', size: 'M', colorName: 'Camel', additionalPrice: 0 }],
  },
  {
    id: 'p2',
    title: 'Relaxed Fit Heavyweight Cotton Overshirt',
    slug: 'relaxed-fit-heavyweight-cotton-overshirt',
    basePrice: 120.00,
    category: { name: "Men's Collection" },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v2', size: 'L', colorName: 'Olive Green', additionalPrice: 0 }],
  },
  {
    id: 'p3',
    title: 'Structured Ribbed Knit Turtleneck',
    slug: 'structured-ribbed-knit-turtleneck',
    basePrice: 95.00,
    category: { name: "Women's Collection" },
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v3', size: 'S', colorName: 'Ivory', additionalPrice: 0 }],
  },
  {
    id: 'p4',
    title: 'Italian Pebble Leather Weekend Tote',
    slug: 'italian-pebble-leather-weekend-tote',
    basePrice: 340.00,
    category: { name: 'Accessories' },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v4', size: 'One Size', colorName: 'Espresso', additionalPrice: 0 }],
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80"
            alt="Fashion Hero Banner"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 flex flex-col items-start justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
            Autumn / Winter 2026 Collection
          </span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight max-w-2xl leading-none">
            Tailored Simplicity. Uncompromising Comfort.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl">
            Discover precision garments constructed from responsible materials. Designed to adapt seamlessly from daily wear to elevated occasions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Shop New Arrivals
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10">
                Explore Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Garments</h2>
            <p className="text-sm text-slate-500 mt-1">Carefully selected staples for this season</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
            View All Apparel &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Banner Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/categories/womens-collection"
            className="group relative h-80 rounded-2xl overflow-hidden bg-slate-900"
          >
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
              alt="Women's Collection"
              fill
              className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent p-6 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white">Women's Collection</h3>
              <p className="text-xs text-slate-300 mt-1">Dresses, Knits, & Outerwear</p>
            </div>
          </Link>

          <Link
            href="/categories/mens-collection"
            className="group relative h-80 rounded-2xl overflow-hidden bg-slate-900"
          >
            <Image
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
              alt="Men's Collection"
              fill
              className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent p-6 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white">Men's Collection</h3>
              <p className="text-xs text-slate-300 mt-1">Suits, Everyday Shirts, & Chinos</p>
            </div>
          </Link>

          <Link
            href="/categories/accessories"
            className="group relative h-80 rounded-2xl overflow-hidden bg-slate-900"
          >
            <Image
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
              alt="Accessories"
              fill
              className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent p-6 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white">Accessories</h3>
              <p className="text-xs text-slate-300 mt-1">Leather Goods, Footwear & Accents</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
