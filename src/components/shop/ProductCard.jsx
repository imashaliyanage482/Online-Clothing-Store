import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/currency';

export default function ProductCard({ product }) {
  const primaryImage = product.images?.[0]?.url || '/hero.png';
  const price = formatCurrency(product.basePrice);

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white rounded">
            Featured
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          {product.category?.name || 'Apparel'}
        </span>
        <h3 className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
          <Link href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </Link>
        </h3>
        <div className="mt-2 flex items-center justify-between text-sm font-bold text-slate-900">
          <span>{price}</span>
          {product.variants?.length > 0 && (
            <span className="text-xs font-normal text-slate-500">
              {product.variants.length} options
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
