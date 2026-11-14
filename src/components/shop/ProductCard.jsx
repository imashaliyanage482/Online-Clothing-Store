'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null
  );
  const [colorImageSelected, setColorImageSelected] = useState(false);

  const descriptionLimit = 70;
  const hasDescription = Boolean(product.description && product.description.trim());
  const isLongDescription = hasDescription && product.description.trim().length > descriptionLimit;

  const imageSrc =
    (colorImageSelected && selectedColor?.image) ||
    product.image ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';

  const numericPrice = product.price ?? product.basePrice ?? 0;
  const originalPrice = product.originalPrice ?? null;
  const isSale = product.isSale || (originalPrice && originalPrice > numericPrice);

  // Sync Wishlist status with localStorage
  useEffect(() => {
    const checkWishlist = () => {
      try {
        const stored = localStorage.getItem('fashionstore_wishlist');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            setIsWishlisted(list.some((item) => item.id === product.id || item.slug === product.slug));
            return;
          }
        }
        setIsWishlisted(false);
      } catch {}
    };

    checkWishlist();
    window.addEventListener('wishlist-updated', checkWishlist);
    return () => window.removeEventListener('wishlist-updated', checkWishlist);
  }, [product.id, product.slug]);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem('fashionstore_wishlist');
      let list = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      const exists = list.some((item) => item.id === product.id || item.slug === product.slug);
      if (exists) {
        list = list.filter((item) => item.id !== product.id && item.slug !== product.slug);
        setIsWishlisted(false);
      } else {
        list.push({
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: numericPrice,
          image: imageSrc,
          category: product.category,
        });
        setIsWishlisted(true);
      }
      localStorage.setItem('fashionstore_wishlist', JSON.stringify(list));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const activeVariant = {
      id: `${product.id}-${product.sizes?.[0] || 'M'}-${(selectedColor || product.colors?.[0])?.name || 'standard'}`,
      size: product.sizes?.[0] || 'M',
      colorName: (selectedColor || product.colors?.[0])?.name || 'Standard',
      additionalPrice: 0,
    };
    addToCart(
      { ...product, image: imageSrc, images: [{ url: imageSrc }] },
      activeVariant,
      1
    );
  };

  return (
    <div className="group relative flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#B69A7A]/30 hover:border-[#B69A7A] hover:shadow-xl transition-all duration-300 h-full">
      {/* ── Product Image & Floating Controls ── */}
      <div className="relative aspect-[3/4] w-full bg-[#EBE3D5] overflow-hidden">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={product.title}
        >
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#252525] hover:text-red-500 hover:bg-white shadow transition-all cursor-pointer z-20"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#252525]'
            }`}
          />
        </button>

        {/* Badges */}
        {isSale && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#252525] text-[#F5F0E8] rounded-full border border-[#B69A7A]/40 shadow-sm z-10 pointer-events-none">
            SALE
          </span>
        )}
        {!isSale && product.isNew && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#B69A7A] text-[#252525] rounded-full shadow-sm z-10 pointer-events-none">
            NEW
          </span>
        )}

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-3 rounded-xl bg-[#252525]/95 text-[#F5F0E8] text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm hover:bg-[#B69A7A] hover:text-[#252525] transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>
            className="w-full py-2 bg-[#252525]/95 backdrop-blur-sm text-[#F5F0E8] text-[11px] font-semibold tracking-wider uppercase rounded-xl hover:bg-[#B69A7A] hover:text-[#252525] transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Bag</span>
          </button>
        </div>
      </Link>

      {/* ── Product Details ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <Link
          href={`/products/${product.slug}`}
          className="relative z-10 block rounded-sm outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B69A7A]"
          aria-label={`View ${product.title}`}
        >
          <span className="text-[10px] text-[#B69A7A] uppercase tracking-wider font-semibold block truncate">
            {product.category?.name || product.category || 'Atelier'}
          </span>

          <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#252525] group-hover:text-[#B69A7A] transition-colors line-clamp-1 mt-0.5">
            {product.title}
          </h3>
        </Link>

        {hasDescription && (
          <div className="text-[11px] sm:text-xs text-[#252525]/70 mt-1 leading-relaxed font-light relative z-20">
            {isLongDescription ? (
              showFullDesc ? (
                <p>
                  {product.description}{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowFullDesc(false);
                    }}
                    className="text-[10.5px] sm:text-[11px] font-semibold text-[#B69A7A] hover:text-[#252525] underline cursor-pointer inline ml-0.5"
                  >
                    See less
                  </button>
                </p>
              ) : (
                <p>
                  {product.description.slice(0, descriptionLimit).trim()}...{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowFullDesc(true);
                    }}
                    className="text-[10.5px] sm:text-[11px] font-semibold text-[#B69A7A] hover:text-[#252525] underline cursor-pointer inline ml-0.5"
                  >
                    See more
                  </button>
                </p>
              )
            ) : (
              <p>{product.description}</p>
            )}
          </div>
        )}

        <div className="mt-auto pt-2.5 border-t border-[#B69A7A]/20 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-[#252525]">
              {formatPrice(numericPrice)}
            </span>
            {originalPrice && (
              <span className="text-[10px] text-[#252525]/45 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="sm:hidden text-[10px] font-bold text-[#B69A7A] uppercase tracking-wider"
          >
            View →
          </Link>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="relative z-20 flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(c);
                  setColorImageSelected(true);
                }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                  selectedColor?.name === c.name
                    ? 'ring-1 ring-[#252525]'
                    : 'hover:bg-[#252525]/5'
                }`}
                title={c.name}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex || '#252525' }}
                />
              </button>
            ))}
            {product.colors.length > 4 && (
              <span className="text-[9px] text-[#252525]/50">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
