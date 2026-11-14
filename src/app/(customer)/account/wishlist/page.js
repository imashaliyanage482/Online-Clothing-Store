'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CustomerHeader from '@/components/customer/CustomerHeader';
import { formatCurrency } from '@/lib/utils/currency';
import { Heart, Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem('fashionstore_wishlist');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
          setLoaded(true);
          return;
        }
      }
    } catch {}
    setWishlistItems([]);
    setLoaded(true);
  };

  useEffect(() => {
    loadWishlist();

    const handleUpdate = () => loadWishlist();
    window.addEventListener('wishlist-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('wishlist-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleRemove = (id) => {
    try {
      const updated = wishlistItems.filter((item) => item.id !== id);
      setWishlistItems(updated);
      localStorage.setItem('fashionstore_wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const handleQuickAdd = (item) => {
    const activeVariant = {
      id: `${item.id}-M-Standard`,
      size: 'M',
      colorName: 'Standard',
      additionalPrice: 0,
    };
    addToCart(
      {
        id: item.id,
        title: item.title,
        slug: item.slug,
        price: item.price,
        image: item.image,
        images: [{ url: item.image }],
      },
      activeVariant,
      1
    );
    setToastMessage(`Added "${item.title}" to cart!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 text-[#252525] max-w-6xl">
      <CustomerHeader
        title="Saved Wishlist"
        subtitle="Garments you have favorited while browsing our atelier collections."
      />

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold shadow-sm animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {!loaded ? (
        <div className="p-12 text-center text-xs text-[#252525]/60 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30">
          Loading your saved garments…
        </div>
      ) : wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-[3/4] w-full bg-[#EBE3D5] overflow-hidden">
                <Link href={`/products/${item.slug}`} className="absolute inset-0">
                  <Image
                    src={item.image || '/images/product-wool-coat.jpg'}
                    alt={item.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  title="Remove from wishlist"
                  className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-rose-600 hover:bg-rose-50 shadow-sm transition-all cursor-pointer z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  {item.category && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B69A7A] block truncate mb-1">
                      {typeof item.category === 'object' ? item.category.name : item.category}
                    </span>
                  )}
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-serif text-sm font-bold text-[#252525] hover:text-[#B69A7A] transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <div className="font-bold text-xs text-[#252525] mt-1 font-mono">
                    {formatCurrency(item.price)}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#B69A7A]/20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-[#3d3d3d] transition-colors shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#B69A7A]" />
                    <span>Add to Cart</span>
                  </button>

                  <Link
                    href={`/products/${item.slug}`}
                    className="py-2 px-3 rounded-xl border border-[#B69A7A]/40 bg-white text-xs font-semibold text-[#252525] hover:bg-[#FAF7F2] transition-colors shadow-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 sm:p-16 text-center space-y-4 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#F5F0E8] border border-[#B69A7A]/30 flex items-center justify-center text-[#B69A7A] mx-auto">
            <Heart className="w-6 h-6 stroke-[1.6]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#252525]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#252525]/65 max-w-sm mx-auto font-light leading-relaxed">
              You haven&apos;t saved any favorites yet. Click the heart icon on any garment you love while browsing to save it here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/women"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-[#3d3d3d] transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B69A7A]" />
              <span>Explore Collections</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
