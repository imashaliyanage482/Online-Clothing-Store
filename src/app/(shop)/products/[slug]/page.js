'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils/currency';
import SizeSelector from '@/components/shop/SizeSelector';
import ColorSelector from '@/components/shop/ColorSelector';
import QuantitySelector from '@/components/shop/QuantitySelector';
import Button from '@/components/ui/Button';
import { Check, ShoppingBag, ShieldCheck, RefreshCw } from 'lucide-react';

const demoProduct = {
  id: 'p1',
  title: 'Merino Wool Minimalist Trench Coat',
  slug: 'merino-wool-minimalist-trench-coat',
  description: 'Meticulously tailored from 100% ethically sourced Australian Merino wool. Engineered to provide warmth without weight, this piece features subtle horn buttons, a structured storm flap, and a tailored double-breasted closure.',
  basePrice: 285.00,
  category: { name: "Women's Collection" },
  images: [
    { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: [
    { name: 'Camel', hex: '#c19a6b' },
    { name: 'Onyx Black', hex: '#111827' },
    { name: 'Slate Grey', hex: '#64748b' },
  ],
  variants: [
    { id: 'v1-m-camel', size: 'M', colorName: 'Camel', additionalPrice: 0, stockQuantity: 14 },
    { id: 'v1-s-camel', size: 'S', colorName: 'Camel', additionalPrice: 0, stockQuantity: 8 },
    { id: 'v1-m-black', size: 'M', colorName: 'Onyx Black', additionalPrice: 0, stockQuantity: 20 },
  ],
};

export default function ProductDetailPage({ params }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(demoProduct.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const activeVariant = demoProduct.variants.find(
      (v) => v.size === selectedSize && v.colorName === selectedColor.name
    ) || {
      id: `${demoProduct.id}-${selectedSize}-${selectedColor.name}`,
      size: selectedSize,
      colorName: selectedColor.name,
      additionalPrice: 0,
    };

    addToCart(demoProduct, activeVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Images */}
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <Image
            src={demoProduct.images[0].url}
            alt={demoProduct.title}
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Right: Product Details & Controls */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              {demoProduct.category.name}
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              {demoProduct.title}
            </h1>
            <div className="mt-3 text-2xl font-bold text-slate-900">
              {formatCurrency(demoProduct.basePrice)}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 border-t border-b border-slate-100 py-4">
            {demoProduct.description}
          </p>

          {/* Size Selector */}
          <SizeSelector
            sizes={demoProduct.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />

          {/* Color Selector */}
          <ColorSelector
            colors={demoProduct.colors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />

          {/* Quantity and Add to Cart */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Quantity
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              />
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Bag
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-900" />
              <span>Certified Sustainable Wool</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-slate-900" />
              <span>Complimentary 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
