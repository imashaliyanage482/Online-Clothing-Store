'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import Input from '@/components/ui/Input';
import { Search } from 'lucide-react';

const mockCatalog = [
  {
    id: 'p1',
    title: 'Merino Wool Minimalist Trench Coat',
    slug: 'merino-wool-minimalist-trench-coat',
    basePrice: 285.00,
    category: { name: "Women's Collection" },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v1', size: 'M', colorName: 'Camel' }],
  },
  {
    id: 'p2',
    title: 'Relaxed Fit Heavyweight Cotton Overshirt',
    slug: 'relaxed-fit-heavyweight-cotton-overshirt',
    basePrice: 120.00,
    category: { name: "Men's Collection" },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v2', size: 'L', colorName: 'Olive Green' }],
  },
  {
    id: 'p3',
    title: 'Structured Ribbed Knit Turtleneck',
    slug: 'structured-ribbed-knit-turtleneck',
    basePrice: 95.00,
    category: { name: "Women's Collection" },
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v3', size: 'S', colorName: 'Ivory' }],
  },
  {
    id: 'p4',
    title: 'Italian Pebble Leather Weekend Tote',
    slug: 'italian-pebble-leather-weekend-tote',
    basePrice: 340.00,
    category: { name: 'Accessories' },
    isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' }],
    variants: [{ id: 'v4', size: 'One Size', colorName: 'Espresso' }],
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const filteredProducts = mockCatalog.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="max-w-xl mx-auto text-center space-y-4 mb-12">
          <span className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase block">
            EXPLORE CATALOGUE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#252525]">
            Search Apparel
          </h1>
          <p className="text-sm text-[#252525]/75 font-light">
            Find luxury garments by cut, collection, or fabric
          </p>
          <div className="relative pt-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trench coat, wool, knitwear..."
              className="pl-11 h-12 text-sm rounded-full bg-[#FAF7F2] border-[#B69A7A]/50 text-[#252525]"
            />
            <Search className="w-4 h-4 text-[#B69A7A] absolute left-4 top-5.5 pointer-events-none" />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-8 max-w-md mx-auto">
            <p className="text-sm text-[#252525]/70">No garments match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
