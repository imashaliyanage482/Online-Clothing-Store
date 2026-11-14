'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import SizeSelector from '@/components/shop/SizeSelector';
import ColorSelector from '@/components/shop/ColorSelector';
import QuantitySelector from '@/components/shop/QuantitySelector';
import Button from '@/components/ui/Button';
import {
  Check,
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
  Heart,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const fallbackProduct = {
  id: 'p1',
  title: 'Merino Wool Minimalist Trench Coat',
  slug: 'merino-wool-minimalist-trench-coat',
  description:
    'Meticulously tailored from 100% ethically sourced Australian Merino wool. Engineered to provide warmth without weight, this piece features subtle horn buttons, a structured storm flap, and a tailored double-breasted closure.',
  price: 28500,
  originalPrice: null,
  category: "Women's Collection",
  image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
  sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  colors: [
    { name: 'Camel', hex: '#c19a6b' },
    { name: 'Onyx Black', hex: '#252525' },
    { name: 'Warm Beige', hex: '#B69A7A' },
  ],
};

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  const router = useRouter();
  const { addToCart } = useCart();
  const { settings, formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.product) {
          const p = data.product;
          setProduct(p);
          setSelectedSize(p.sizes?.[0] || 'M');
          setSelectedColor(p.colors?.[0] || { name: 'Standard', hex: '#252525' });
          setActiveImage(p.image || p.colors?.[0]?.image || '');
        } else {
          setProduct(fallbackProduct);
          setSelectedSize('M');
          setSelectedColor(fallbackProduct.colors[0]);
          setActiveImage(fallbackProduct.image);
        }
      })
      .catch(() => {
        setProduct(fallbackProduct);
        setSelectedSize('M');
        setSelectedColor(fallbackProduct.colors[0]);
        setActiveImage(fallbackProduct.image);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const p = product || fallbackProduct;

  useEffect(() => {
    const targetId = p.id;
    const targetSlug = p.slug;

    const checkWishlist = () => {
      try {
        const stored = localStorage.getItem('fashionstore_wishlist');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            setIsWishlisted(list.some((item) => item.id === targetId || item.slug === targetSlug));
            return;
          }
        }
        setIsWishlisted(false);
      } catch {}
    };

    checkWishlist();
    window.addEventListener('wishlist-updated', checkWishlist);
    return () => window.removeEventListener('wishlist-updated', checkWishlist);
  }, [p.id, p.slug]);

  const handleToggleWishlist = () => {
    try {
      const stored = localStorage.getItem('fashionstore_wishlist');
      let list = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      const exists = list.some((item) => item.id === p.id || item.slug === p.slug);
      if (exists) {
        list = list.filter((item) => item.id !== p.id && item.slug !== p.slug);
        setIsWishlisted(false);
      } else {
        list.push({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: Number(p.price) || 0,
          image: activeImage || p.image,
          category: p.category,
        });
        setIsWishlisted(true);
      }
      localStorage.setItem('fashionstore_wishlist', JSON.stringify(list));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      setIsWishlisted(!isWishlisted);
    }
  };

  const galleryImages = [...new Set([
    p.image,
    ...(Array.isArray(p.images)
      ? p.images.map((image) => (typeof image === 'string' ? image : image?.url))
      : []),
    ...(Array.isArray(p.colors) ? p.colors.map((color) => color.image) : []),
  ].filter(Boolean))];

  const handleAddToCart = () => {
    const activeVariant = {
      id: `${p.id}-${selectedSize}-${selectedColor?.name || 'standard'}`,
      size: selectedSize,
      colorName: selectedColor?.name || 'Standard',
      additionalPrice: 0,
    };

    const selectedImage = activeImage || selectedColor?.image || p.image;
    addToCart(
      { ...p, image: selectedImage, images: [{ url: selectedImage }] },
      activeVariant,
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    const activeVariant = {
      id: `${p.id}-${selectedSize}-${selectedColor?.name || 'standard'}`,
      size: selectedSize,
      colorName: selectedColor?.name || 'Standard',
      additionalPrice: 0,
    };

    const selectedImage = activeImage || selectedColor?.image || p.image;
    addToCart(
      { ...p, image: selectedImage, images: [{ url: selectedImage }] },
      activeVariant,
      quantity
    );
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="aspect-[3/4] w-full bg-[#EBE3D5]/70 rounded-2xl border border-[#B69A7A]/20" />
            <div className="space-y-6 pt-4">
              <div className="h-4 w-28 bg-[#B69A7A]/30 rounded" />
              <div className="h-9 w-3/4 bg-[#252525]/15 rounded" />
              <div className="h-6 w-36 bg-[#252525]/20 rounded" />
              <div className="h-20 w-full bg-[#252525]/10 rounded-xl" />
              <div className="h-12 w-full bg-[#252525]/15 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center text-xs text-[#252525]/60 gap-2">
          <Link href="/" className="hover:text-[#252525]">Home</Link>
          <span>/</span>
          {p.category && (
            <>
              <span className="text-[#252525]/80">{p.category}</span>
              <span>/</span>
            </>
          )}
          <span className="text-[#252525] font-semibold truncate max-w-[200px]">{p.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ── Left Column: Product Image Gallery ── */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full bg-[#EBE3D5] rounded-2xl overflow-hidden border border-[#B69A7A]/30 shadow-md">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={p.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-[#252525] hover:text-red-500 hover:bg-white shadow-md transition-all cursor-pointer z-10"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#252525]'
                  }`}
                />
              </button>

              {/* Sale or New Badge */}
              {p.isSale && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#252525] text-[#F5F0E8] text-[10.5px] font-bold tracking-widest uppercase rounded-full shadow">
                  SALE
                </span>
              )}
              {!p.isSale && p.isNew && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#B69A7A] text-[#252525] text-[10.5px] font-bold tracking-widest uppercase rounded-full shadow">
                  NEW SEASON
                </span>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="flex flex-wrap gap-2" aria-label="Product images">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(image);
                      const matchingColor = p.colors?.find((color) => color.image === image);
                      if (matchingColor) setSelectedColor(matchingColor);
                    }}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={activeImage === image}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === image ? 'border-[#252525]' : 'border-[#B69A7A]/30'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${p.title} image ${index + 1}`}
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right Column: Garment Details & Purchase ── */}
          <div className="space-y-7">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-1.5">
                {p.category || 'Atelier Collection'}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#252525]">
                {p.title}
              </h1>

              {/* Price display in LKR */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#252525]">
                  {formatPrice(p.price)}
                </span>
                {p.originalPrice && (
                  <span className="text-base text-[#252525]/50 line-through">
                    {formatPrice(p.originalPrice)}
                  </span>
                )}
                {p.originalPrice && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Save {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#252525]/80 font-light leading-relaxed">
              {p.description}
            </p>

            {/* Color Swatches */}
            {p.colors && p.colors.length > 0 && (
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#252525] mb-2.5">
                  Color: <span className="text-[#B69A7A]">{selectedColor?.name || 'Selected'}</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {p.colors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setActiveImage(color.image || p.image);
                      }}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor?.name === color.name
                          ? 'border-[#252525] scale-110 shadow-sm'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex || '#252525' }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {p.sizes && p.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#252525]">
                    Size Selection
                  </label>
                  <span className="text-[11px] text-[#B69A7A] font-semibold uppercase">
                    True to Bespoke Fit
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-11 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                        selectedSize === size
                          ? 'bg-[#252525] text-[#F5F0E8] border-[#252525] shadow'
                          : 'bg-white text-[#252525] border-[#B69A7A]/40 hover:bg-[#B69A7A]/15'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center border border-[#B69A7A]/40 rounded-xl bg-white p-1 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold text-[#252525] hover:bg-[#B69A7A]/15 rounded-lg disabled:opacity-30 cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs text-[#252525]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold text-[#252525] hover:bg-[#B69A7A]/15 rounded-lg cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-4 rounded-xl border border-[#252525] bg-white text-[#252525] font-semibold text-xs tracking-wider uppercase hover:bg-[#252525] hover:text-[#F5F0E8] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-[#B69A7A]" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#B69A7A]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              {/* Direct Order Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#252525] text-[#F5F0E8] font-semibold text-xs tracking-wider uppercase hover:bg-[#B69A7A] hover:text-[#252525] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-[#B69A7A]" />
                <span>Order Now • {formatPrice(p.price * quantity)}</span>
              </button>

              {/* Wishlist Action Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isWishlisted
                    ? 'bg-red-50 border-red-300 text-red-500 shadow-sm'
                    : 'bg-white border-[#B69A7A]/40 text-[#252525] hover:bg-[#B69A7A]/15'
                }`}
                aria-label="Wishlist"
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#252525]'}`} />
              </button>
            </div>

            {/* Atelier Quality Accents */}
            <div className="pt-6 border-t border-[#B69A7A]/30 space-y-3.5 text-xs text-[#252525]/75">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#B69A7A] shrink-0" />
                <span>
                  {Number(settings.freeShippingThreshold) === 0
                    ? 'Complimentary courier shipping on all orders'
                    : `Complimentary courier shipping on orders of ${formatPrice(settings.freeShippingThreshold)} or more`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#B69A7A] shrink-0" />
                <span>Certified authentic sustainable textiles with luxury finish</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-[#B69A7A] shrink-0" />
                <span>14-day complimentary sizing exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
