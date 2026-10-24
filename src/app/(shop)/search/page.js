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
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const filteredProducts = mockCatalog.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-xl mx-auto text-center space-y-4 mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Search Apparel</h1>
        <p className="text-sm text-slate-500">Find clothing by name, style, or collection</p>
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trench coat, wool, knitwear..."
            className="pl-10 h-12 text-base"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
