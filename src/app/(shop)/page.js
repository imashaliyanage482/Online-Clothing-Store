'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Check,
  Sparkles,
} from 'lucide-react';
import EditorialHero from '@/components/shop/EditorialHero';
import HomeHeroSlider from '@/components/shop/HomeHeroSlider';

const featuredCategories = [
  {
    id: 'women',
    name: 'Women',
    href: '/women',
    image: '/images/home-category-women.png',
    subtitle: 'Tailored workwear, fluid silk, & denim',
    className: 'aspect-[736/1307] lg:row-span-2',
  },
  {
    id: 'men',
    name: 'Men',
    href: '/men',
    image: '/images/home-category-men-latest.png',
    subtitle: 'Sharp essentials & premium outerwear',
    className: 'aspect-square lg:col-start-2 lg:row-start-1',
  },
  {
    id: 'collection',
    name: 'Collections',
    href: '/collections',
    image: '/images/home-category-collection.jpg',
    subtitle: 'Curated seasonal drops & best sellers',
    className: 'col-span-1 aspect-[15/7] sm:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-2',
  },
];

export default function HomePage() {
  const { settings, formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const [selectedSwatches, setSelectedSwatches] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetch('/api/products?bestSellers=true&status=ACTIVE')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load featured products.');
        }

        const items = (data.products || []).slice(0, 8).map((product) => ({
          ...product,
          category: product.category?.name || product.category || (product.gender === 'women' ? 'Women' : 'Men'),
          swatches: product.colors?.length
            ? product.colors.map((color) => ({
                name: color.name,
                color: color.hex,
                image: color.image,
              }))
            : [{ name: 'Standard', color: '#252525' }],
        }));

        setFeaturedProducts(items);
      })
      .catch((error) => {
        console.error('Failed fetching homepage products:', error);
      })
      .finally(() => {
        setLoading(false);
      });

    // Sync wishlist state from localStorage
    const syncWishlistFromStorage = () => {
      try {
        const stored = localStorage.getItem('fashionstore_wishlist');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            const map = {};
            list.forEach((item) => {
              map[item.id] = true;
            });
            setWishlist(map);
            return;
          }
        }
        setWishlist({});
      } catch {}
    };

    syncWishlistFromStorage();
    window.addEventListener('wishlist-updated', syncWishlistFromStorage);
    window.addEventListener('storage', syncWishlistFromStorage);

    return () => {
      window.removeEventListener('wishlist-updated', syncWishlistFromStorage);
      window.removeEventListener('storage', syncWishlistFromStorage);
    };
  }, []);

  const toggleWishlist = (product) => {
    try {
      const stored = localStorage.getItem('fashionstore_wishlist');
      let list = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      const exists = list.some((item) => item.id === product.id || item.slug === product.slug);
      const swatchIndex = selectedSwatches[product.id] || 0;
      const prodImg =
        product.swatches?.[swatchIndex]?.image ||
        product.image ||
        (Array.isArray(product.images)
          ? typeof product.images[0] === 'string'
            ? product.images[0]
            : product.images[0]?.url
          : '/images/product-wool-coat.jpg');

      if (exists) {
        list = list.filter((item) => item.id !== product.id && item.slug !== product.slug);
        setWishlist((prev) => {
          const next = { ...prev };
          delete next[product.id];
          if (product.slug) delete next[product.slug];
          return next;
        });
      } else {
        list.push({
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          image: prodImg,
          category: product.category,
        });
        setWishlist((prev) => ({
          ...prev,
          [product.id]: true,
          ...(product.slug ? { [product.slug]: true } : {}),
        }));
      }
      localStorage.setItem('fashionstore_wishlist', JSON.stringify(list));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch {
      setWishlist((prev) => ({ ...prev, [product.id]: !prev[product.id] }));
    }
  };

  const handleAddToCart = (product) => {
    const swatchIndex = selectedSwatches[product.id] || 0;
    const swatch = product.swatches[swatchIndex];

    addToCart(
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        basePrice: product.price,
        image: swatch.image || product.image,
        images: [{ url: swatch.image || product.image }],
      },
      {
        id: `${product.id}-${swatch.name}`,
        size: 'M',
        colorName: swatch.name,
        additionalPrice: 0,
      },
      1
    );

    setToastMessage(`Added "${product.title}" (${swatch.name}) to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="bg-[#F5F0E8] text-[#252525]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#252525] text-[#F5F0E8] border border-[#B69A7A] px-5 py-3 rounded-full shadow-2xl text-xs tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-[#B69A7A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <HomeHeroSlider />

      {/* ── 2. SHOP BY CATEGORY ── */}
      <section className="pt-8 pb-12 sm:pt-14 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:aspect-[1.24/1] lg:grid-cols-[5fr_6fr] lg:grid-rows-[2.14fr_1fr]">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group relative block overflow-hidden rounded-2xl bg-[#EBE3D5] border border-[#B69A7A]/30 ${category.className}`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 58vw"
                className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252525]/70 via-[#252525]/15 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <p className="mb-1 text-[9px] tracking-[0.15em] uppercase text-[#F5F0E8]/80 sm:text-[11px] sm:tracking-[0.25em]">
                  {category.subtitle}
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium tracking-wide text-[#F5F0E8]">
                    {category.name}
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-[#F5F0E8]/90 text-[#252525] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. BEST SELLERS / FEATURED PRODUCTS ── */}
      <section className="py-12 sm:py-20 bg-[#F5F0E8] border-t border-[#B69A7A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-7 sm:mb-12">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252525] tracking-tight">
                Best Sellers
              </h2>
            </div>
          </div>

          {/* 4-Column Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex min-w-0 flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#B69A7A]/20 animate-pulse">
                  <div className="aspect-[3/4] w-full bg-[#EBE3D5]/60" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-16 bg-[#B69A7A]/20 rounded" />
                    <div className="h-4 w-3/4 bg-[#252525]/15 rounded" />
                    <div className="h-4 w-1/3 bg-[#252525]/20 rounded" />
                    <div className="h-9 w-full bg-[#252525]/10 rounded-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {featuredProducts.map((product) => {
                const currentSwatchIndex = selectedSwatches[product.id] || 0;
                const isWishlisted = !!wishlist[product.id];

                return (
                  <div
                    key={product.id}
                    className="flex min-w-0 flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#B69A7A]/30 hover:border-[#B69A7A] hover:shadow-lg transition-all duration-300 group h-full"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-[3/4] w-full bg-[#EBE3D5] overflow-hidden">
                      <Link href={`/products/${product.slug}`} className="absolute inset-0">
                        <Image
                          src={product.swatches[currentSwatchIndex]?.image || product.images?.[0]?.url || product.image || '/images/product-wool-coat.jpg'}
                          alt={product.title}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        aria-label="Save to wishlist"
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5F0E8]/90 backdrop-blur-sm flex items-center justify-center text-[#252525] hover:bg-[#F5F0E8] transition-all shadow-sm cursor-pointer z-10"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isWishlisted
                              ? 'fill-red-500 text-red-500'
                              : 'text-[#252525]/70 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 sm:p-5 flex flex-col flex-1">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block rounded-sm outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B69A7A]"
                        aria-label={`View ${product.title}`}
                      >
                        <span className="text-[9px] sm:text-[10.5px] font-semibold tracking-wider text-[#B69A7A] uppercase mb-1 truncate block">
                          {product.category}
                        </span>
                        <h3 className="font-serif text-sm sm:text-base font-semibold text-[#252525] group-hover:text-[#B69A7A] transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-[#252525] mt-1.5">
                          {formatPrice(product.price)}
                        </p>
                      </Link>

                      {/* Color Swatches */}
                      {product.swatches && product.swatches.length > 0 && (
                        <div className="flex items-center gap-1 sm:gap-1.5 mt-2.5 mb-3">
                          {product.swatches.slice(0, 4).map((swatch, idx) => {
                            const isSelected = currentSwatchIndex === idx;
                            return (
                              <button
                                key={swatch.name}
                                onClick={() =>
                                  setSelectedSwatches((prev) => ({
                                    ...prev,
                                    [product.id]: idx,
                                  }))
                                }
                                aria-label={`Select color ${swatch.name}`}
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer ${
                                  isSelected
                                    ? 'ring-1 ring-offset-1 ring-[#252525]'
                                    : 'hover:bg-[#252525]/5'
                                }`}
                              >
                                <span
                                  className="h-3.5 w-3.5 rounded-full border border-[#252525]/20"
                                  style={{ backgroundColor: swatch.color }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="mt-auto pt-3 border-t border-[#B69A7A]/25 flex items-center gap-1.5 sm:gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex min-h-10 flex-1 items-center justify-center text-center py-2 px-3 rounded-full text-[10.5px] sm:text-xs font-semibold text-[#252525] border border-[#B69A7A] hover:bg-[#B69A7A]/15 transition-all truncate"
                        >
                          View Piece
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252525] text-[#F5F0E8] hover:bg-[#B69A7A] hover:text-[#252525] transition-all cursor-pointer shadow-sm shrink-0"
                          aria-label="Add to Bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!featuredProducts.length && (
            <p className="py-12 text-center text-sm text-[#252525]/65">
              Best sellers will appear here as customer orders come in.
            </p>
          )}
        </div>
      </section>

      {/* ── 4. BRAND PHILOSOPHY / ABOUT ATELIER CARD ── */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#FAF7F2] border border-[#B69A7A]/35 shadow-xl transition-all duration-300 hover:border-[#B69A7A]/60">
          {/* Subtle background glow/accent */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B69A7A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#B69A7A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B69A7A]/15 border border-[#B69A7A]/30 w-fit mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#B69A7A]" />
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase">
                  OUR STORY &amp; HERITAGE
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-[40px] font-bold text-[#252525] leading-[1.18] tracking-tight mb-4">
                Conscious Craftsmanship, Modern Silhouettes
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-[#252525]/80 leading-relaxed font-light mb-6">
                FashionStore was founded on the belief that everyday wardrobe essentials should transcend fleeting trends. We combine ethical, traceable wool, lustrous silk, and organic cotton with heirloom-grade garment construction crafted to endure for generations.
              </p>

              {/* Quality Highlights Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/70 border border-[#B69A7A]/25">
                  <div className="w-6 h-6 rounded-full bg-[#B69A7A]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#252525]" />
                  </div>
                  <span className="text-[11px] font-medium text-[#252525]">Traceable Fibers</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/70 border border-[#B69A7A]/25">
                  <div className="w-6 h-6 rounded-full bg-[#B69A7A]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#252525]" />
                  </div>
                  <span className="text-[11px] font-medium text-[#252525]">Atelier Tailored</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/70 border border-[#B69A7A]/25">
                  <div className="w-6 h-6 rounded-full bg-[#B69A7A]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#252525]" />
                  </div>
                  <span className="text-[11px] font-medium text-[#252525]">Ethical Luxury</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2.5 bg-[#252525] text-[#F5F0E8] text-xs font-semibold uppercase tracking-wider px-7 py-3.5 rounded-full hover:bg-[#B69A7A] hover:text-[#252525] transition-all duration-300 shadow-md group"
                >
                  <span>Learn About Our Craft</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#252525] hover:text-[#B69A7A] px-5 py-3 transition-colors"
                >
                  <span>View Collections</span>
                </Link>
              </div>
            </div>

            {/* Right Image Card Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden border border-[#B69A7A]/30 shadow-lg group">
                <Image
                  src="/images/hero-editorial.jpg"
                  alt="FashionStore Atelier Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Glassmorphic Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#FAF7F2]/90 backdrop-blur-md border border-[#B69A7A]/35 text-[#252525] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-[#B69A7A] uppercase tracking-wider">
                        FLAGSHIP ATELIER
                      </p>
                      <p className="font-serif text-sm font-bold text-[#252525]">
                        Colombo 07, Sri Lanka
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-[#252525]/75">
                      Est. 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. DUAL PROMOTIONAL BANNERS / SALE EDIT ── */}
      <section className="py-8 pb-12 sm:py-12 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Banner 1: New Season Essentials (7 cols) */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[420px] flex items-center bg-[#E5DCD1] border border-[#B69A7A]/30">
            <Image
              src="/images/promo-timeless.jpg"
              alt="Timeless Pieces for Modern Living"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#252525]/75 via-[#252525]/45 to-transparent" />

            <div className="relative z-10 p-6 sm:p-12 max-w-md text-[#F5F0E8]">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-3">
                LIMITED DROP
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#F5F0E8] leading-[1.12] mb-4">
                Timeless Pieces for Modern Life.
              </h3>
              <p className="text-xs text-[#F5F0E8]/85 mb-7 font-light leading-relaxed">
                Explore our signature light-wash outerwear and tailored trousers designed for effortless rotation.
              </p>
              <Link
                href="/collections/new-arrivals"
                className="inline-flex items-center gap-2.5 bg-[#F5F0E8] text-[#252525] text-xs font-semibold px-7 py-3.5 rounded-full hover:bg-[#B69A7A] hover:text-[#252525] transition-all shadow-sm"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Banner 2: SALE / Special Edit (5 cols) */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[420px] flex items-center bg-[#252525] border border-[#B69A7A]/40">
            <Image
              src="/images/promo-knitwear.jpg"
              alt="Special Offer Knitwear"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-right opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#252525] via-[#252525]/85 to-transparent" />

            <div className="relative z-10 p-6 sm:p-12 max-w-sm text-[#F5F0E8]">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-3">
                SEASONAL PROMOTION
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5F0E8] leading-[1.12] mb-3">
                The Seasonal Archive Edit
              </h3>
              <p className="text-xs text-[#F5F0E8]/80 mb-7 font-light leading-relaxed">
                Selected outerwear, knitwear, and silk shirts now available at up to 40% off.
              </p>
              <Link
                href="/sale"
                className="inline-flex items-center gap-2.5 bg-[#F5F0E8] text-[#252525] border border-[#B69A7A] text-xs font-semibold px-7 py-3.5 rounded-full hover:bg-[#B69A7A] hover:text-[#252525] transition-all"
              >
                <span>Explore SALE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. TRUST & VALUE PROPOSITIONS BAR ── */}
      <section className="py-14 border-t border-[#B69A7A]/30 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Free Shipping */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#F5F0E8] border border-[#B69A7A]/40 flex items-center justify-center text-[#252525]">
                <Truck className="w-5 h-5 stroke-[1.6]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#252525]">Complimentary Shipping</h4>
                <p className="text-[11px] sm:text-xs text-[#252525]/70 mt-0.5">
                  {Number(settings.freeShippingThreshold) === 0
                    ? 'On all orders'
                    : `On orders of ${formatPrice(settings.freeShippingThreshold)} or more`}
                </p>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#F5F0E8] border border-[#B69A7A]/40 flex items-center justify-center text-[#252525]">
                <RotateCcw className="w-5 h-5 stroke-[1.6]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#252525]">Bespoke Returns</h4>
                <p className="text-[11px] sm:text-xs text-[#252525]/70 mt-0.5">30-day effortless policy</p>
              </div>
            </div>

            {/* Certified Quality */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#F5F0E8] border border-[#B69A7A]/40 flex items-center justify-center text-[#252525]">
                <ShieldCheck className="w-5 h-5 stroke-[1.6]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#252525]">Ethical Materials</h4>
                <p className="text-[11px] sm:text-xs text-[#252525]/70 mt-0.5">Traceable natural fibers</p>
              </div>
            </div>

            {/* 24/7 Concierge */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#F5F0E8] border border-[#B69A7A]/40 flex items-center justify-center text-[#252525]">
                <Headphones className="w-5 h-5 stroke-[1.6]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#252525]">Client Concierge</h4>
                <p className="text-[11px] sm:text-xs text-[#252525]/70 mt-0.5">Dedicated style assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
