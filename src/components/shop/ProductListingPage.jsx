'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Heart, ShoppingBag, Check, SlidersHorizontal } from 'lucide-react';
import EditorialHero from '@/components/shop/EditorialHero';

function normalizeSize(size) {
  const normalized = String(size).trim().toUpperCase();
  if (normalized === 'XXL') return '2XL';
  if (normalized === 'XXXL') return '3XL';
  return normalized;
}

function compareSizes(a, b) {
  const standardSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const aIndex = standardSizes.indexOf(a);
  const bIndex = standardSizes.indexOf(b);
  if (aIndex !== -1 || bIndex !== -1) {
    return (aIndex === -1 ? standardSizes.length : aIndex) -
      (bIndex === -1 ? standardSizes.length : bIndex);
  }

  const aNumber = Number(a);
  const bNumber = Number(b);
  if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) return aNumber - bNumber;
  if (Number.isFinite(aNumber)) return -1;
  if (Number.isFinite(bNumber)) return 1;
  if (a === 'ONE SIZE') return 1;
  if (b === 'ONE SIZE') return -1;
  return a.localeCompare(b, undefined, { numeric: true });
}

/**
 * Reusable Product Listing Page with interactive Sorting, Filtering, and Breadcrumbs.
 * Color theme: Cream (#F5F0E8), Black (#252525), Beige (#B69A7A)
 */
export default function ProductListingPage({
  heading,
  subheading = 'Women',
  description,
  breadcrumbs = [],
  products = [],
  categorySlug,
  gender,
  heroImage,
  belowImageText,
  showHeroCopy = true,
  emptyMessage = 'New atelier releases arriving shortly. Please check back soon.',
  isSale = false,
}) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const shouldFetch = Boolean(categorySlug && gender);
  const [loading, setLoading] = useState(shouldFetch);
  const [catalogProducts, setCatalogProducts] = useState(shouldFetch ? [] : products);
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [saleFilter, setSaleFilter] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (productId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  useEffect(() => {
    if (!categorySlug || !gender) {
      setCatalogProducts(products);
      setLoading(false);
      return;
    }

    setLoading(true);
    const query = new URLSearchParams({ category: categorySlug, gender, status: 'ACTIVE' });
    fetch(`/api/products?${query}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load category products.');
        }
        setCatalogProducts(data.products || []);
      })
      .catch((error) => {
        console.error('Failed fetching category products:', error);
        setCatalogProducts(products || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categorySlug, gender, products]);

  const availableSizes = useMemo(() => {
    const sizes = new Map();
    catalogProducts.forEach((product) => {
      (Array.isArray(product.sizes) ? product.sizes : []).forEach((size) => {
        const key = normalizeSize(size);
        if (key && !sizes.has(key)) {
          sizes.set(key, key === 'ONE SIZE' ? 'One Size' : key);
        }
      });
    });
    return [...sizes.keys()].sort(compareSizes).map((key) => ({
      value: key,
      label: sizes.get(key),
    }));
  }, [catalogProducts]);

  useEffect(() => {
    if (sizeFilter !== 'ALL' && !availableSizes.some((size) => size.value === sizeFilter)) {
      setSizeFilter('ALL');
    }
  }, [availableSizes, sizeFilter]);

  // Default breadcrumbs if not provided
  const activeBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : [
    { label: 'Home', href: '/' },
    { label: 'Women', href: '/women' },
    { label: heading },
  ];
  const listingHeroImage = heroImage || (
    gender === 'men'
      ? '/images/men-hero-lookbook.png'
      : gender === 'women'
        ? '/images/women-main-hero.png'
        : '/images/hero-editorial.jpg'
  );

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = !prev[id];
      showToast(next ? 'Saved to your Wishlist!' : 'Removed from your Wishlist');
      return { ...prev, [id]: next };
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleQuickAdd = (product) => {
    const colorIndex = selectedColors[product.id] || 0;
    const activeColor = product.colors?.[colorIndex];
    const activeColorName = activeColor?.name || 'Standard';
    const activeImage = activeColor?.image || product.image;

    addToCart(
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        basePrice: product.price,
        image: activeImage,
        images: [{ url: activeImage }],
      },
      {
        id: `${product.id}-${activeColorName}`,
        size: product.sizes?.[0] || 'M',
        colorName: activeColorName,
        additionalPrice: 0,
      },
      1
    );

    showToast(`Added "${product.title}" to Shopping Bag`);
  };

  // Filter and Sort
  const processedProducts = useMemo(() => {
    let list = [...catalogProducts];

    // Filter by Size
    if (sizeFilter !== 'ALL') {
      list = list.filter((p) =>
        Array.isArray(p.sizes) &&
        p.sizes.some((size) => normalizeSize(size) === sizeFilter)
      );
    }

    // Filter by Sale Only
    if (saleFilter) {
      list = list.filter((p) => p.isSale || p.originalPrice);
    }

    return list;
  }, [catalogProducts, sizeFilter, saleFilter]);

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#252525] text-[#F5F0E8] border border-[#B69A7A] px-5 py-3 rounded-full shadow-2xl text-xs tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-[#B69A7A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <EditorialHero
        image={listingHeroImage}
        imageAlt={`${heading} collection`}
        breadcrumbs={activeBreadcrumbs}
        eyebrow={subheading ? `${subheading} / THE COLLECTION` : undefined}
        heading={heading}
        description={description}
        belowImageText={belowImageText}
        imageClassName={gender === 'women' ? 'object-contain object-center' : 'object-cover object-top'}
        contentSide={gender === 'men' ? 'right' : 'left'}
        showContent={showHeroCopy}
      />

      {/* ── Product Filters ── */}
      <div className="border-b border-[#B69A7A]/25 bg-[#FAF7F2] sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          
          {/* Left: Size Filters */}
          <div className="-mx-1 flex min-w-0 items-center gap-2 overflow-x-auto px-1 py-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B69A7A] hidden sm:inline mr-1">
              Sizes:
            </span>
            {[{ value: 'ALL', label: 'ALL' }, ...availableSizes].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSizeFilter(value)}
                className={`min-h-9 shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  sizeFilter === value
                    ? 'bg-[#252525] text-[#F5F0E8]'
                    : 'bg-[#F5F0E8] text-[#252525] border border-[#B69A7A]/40 hover:border-[#252525]'
                }`}
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSaleFilter(!saleFilter)}
              className={`ml-2 min-h-9 shrink-0 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                saleFilter
                  ? 'bg-[#252525] text-[#F5F0E8] border border-[#252525]'
                  : 'bg-transparent text-[#252525] border border-[#B69A7A] hover:bg-[#B69A7A]/15'
              }`}
            >
              Sale Only
            </button>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8 lg:-translate-x-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#B69A7A]/20 animate-pulse">
                <div className="aspect-[3/4] w-full bg-[#EBE3D5]/60" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 bg-[#B69A7A]/20 rounded" />
                  <div className="h-4 w-3/4 bg-[#252525]/15 rounded" />
                  <div className="h-3 w-full bg-[#252525]/10 rounded" />
                  <div className="h-4 w-1/3 bg-[#252525]/20 rounded" />
                  <div className="h-9 w-full bg-[#252525]/10 rounded-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : processedProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-8 max-w-md mx-auto">
            <div className="w-14 h-14 bg-[#F5F0E8] border border-[#B69A7A]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B69A7A]">
              <SlidersHorizontal className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#252525] mb-1">
              No matching pieces
            </h3>
            <p className="text-[#252525]/70 text-xs sm:text-sm leading-relaxed mb-6 font-light">
              Try adjusting your size or sale filter to view more styles.
            </p>
            <button
              onClick={() => {
                setSizeFilter('ALL');
                setSaleFilter(false);
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5F0E8] bg-[#252525] rounded-full px-6 py-2.5 hover:bg-[#B69A7A] hover:text-[#252525] transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8 lg:-translate-x-3">
            {processedProducts.map((product) => {
              const currentColorIdx = selectedColors[product.id] || 0;
              const isWishlisted = !!wishlist[product.id];
              const discountPercentage = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;
              const isExpanded = !!expandedDescriptions[product.id];
              const descriptionLimit = 70;
              const hasDescription = Boolean(product.description && product.description.trim());
              const isLongDescription = hasDescription && product.description.trim().length > descriptionLimit;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#B69A7A]/30 hover:border-[#B69A7A] hover:shadow-xl transition-all duration-300 h-full"
                >
                  {/* Image Container with Zoom Effect */}
                  <div className="relative aspect-[3/4] w-full bg-[#EBE3D5] overflow-hidden">
                    <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
                      <Image
                        src={product.colors?.[currentColorIdx]?.image || product.images?.[0]?.url || product.image || '/images/product-wool-coat.jpg'}
                        alt={product.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Add to Wishlist"
                      className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5F0E8]/90 backdrop-blur-sm flex items-center justify-center text-[#252525] hover:bg-[#F5F0E8] hover:scale-110 transition-all shadow-sm cursor-pointer z-10"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                          isWishlisted
                            ? 'fill-[#252525] text-[#252525]'
                            : 'text-[#252525]/75 hover:text-[#252525]'
                        }`}
                      />
                    </button>

                    {/* Promotional Badges */}
                    <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 flex flex-col gap-1 z-10">
                      {(product.isSale || isSale) && (
                        <span className="px-2 py-0.5 text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider bg-[#252525] text-[#F5F0E8] border border-[#B69A7A] rounded-full shadow-sm">
                          {discountPercentage ? `SALE -${discountPercentage}%` : 'SALE'}
                        </span>
                      )}
                      {product.isNew && (
                        <span className="px-2 py-0.5 text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider bg-[#F5F0E8] text-[#252525] border border-[#B69A7A]/40 rounded-full shadow-sm">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 sm:p-5 flex flex-col flex-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block rounded-sm outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B69A7A]"
                      aria-label={`View ${product.title}`}
                    >
                      <span className="text-[9.5px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-[#B69A7A] mb-0.5 truncate block">
                        {product.category || heading}
                      </span>
                      <h3 className="font-serif text-xs sm:text-base font-bold text-[#252525] group-hover:text-[#B69A7A] transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>

                    {hasDescription && (
                      <div className="text-[11px] sm:text-xs text-[#252525]/70 mt-1 leading-relaxed font-light">
                        {isLongDescription ? (
                          isExpanded ? (
                            <p>
                              {product.description}{' '}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleDescription(product.id);
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
                                  toggleDescription(product.id);
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

                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-2.5 sm:mt-3 flex items-baseline gap-1.5 flex-wrap block"
                      aria-label={`Price for ${product.title}`}
                    >
                      <span className="text-xs sm:text-base font-bold text-[#252525]">
                        {formatPrice(Number(product.price))}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-[#252525]/50 line-through">
                          {formatPrice(Number(product.originalPrice))}
                        </span>
                      )}
                    </Link>

                    {/* Color Swatches */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2.5 pt-0.5">
                        {product.colors.slice(0, 3).map((color, idx) => {
                          const isSelected = currentColorIdx === idx;
                          return (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() =>
                                setSelectedColors((prev) => ({
                                  ...prev,
                                  [product.id]: idx,
                                }))
                              }
                              title={color.name}
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer ${
                                isSelected
                                  ? 'ring-1 ring-offset-1 ring-[#252525]'
                                  : 'hover:bg-[#252525]/5'
                              }`}
                            >
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-[#252525]/30"
                                style={{ backgroundColor: color.hex }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="mt-auto pt-3 sm:pt-4 border-t border-[#B69A7A]/25 flex items-center gap-1.5 sm:gap-2.5">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex min-h-10 flex-1 items-center justify-center text-center py-2 sm:py-2.5 px-2 sm:px-4 rounded-full text-[10.5px] sm:text-xs font-semibold text-[#252525] border border-[#B69A7A] hover:bg-[#B69A7A]/15 transition-all truncate"
                      >
                        View Piece
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252525] text-[#F5F0E8] hover:bg-[#B69A7A] hover:text-[#252525] transition-all cursor-pointer shadow-sm shrink-0"
                        aria-label="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
