'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import QuantitySelector from '@/components/shop/QuantitySelector';
import PriceSummary from '@/components/shop/PriceSummary';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { formatPrice } = useCurrency();

  if (cart.length === 0) {
    return (
      <div className="bg-[#F5F0E8] min-h-screen text-[#252525] py-20 px-4">
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="You haven't added any luxury pieces to your shopping bag yet."
          actionLabel="Explore New Arrivals"
          actionHref="/collections/new-arrivals"
        />
      </div>
    );
  }

  const shipping = null;
  const tax = 0;
  const total = cartTotal;

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase block mb-2">
            YOUR SELECTIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#252525] mb-10">
            Shopping Bag
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Item List */}
          <div className="lg:col-span-8 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 divide-y divide-[#B69A7A]/20 overflow-hidden shadow-sm">
            {cart.map((item) => (
              <div key={item.variantId} className="p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-[#EBE3D5] shrink-0 border border-[#B69A7A]/25">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <h3 className="font-serif text-base font-semibold text-[#252525]">{item.title}</h3>
                  <div className="text-xs text-[#252525]/70 space-x-2 font-light">
                    <span>Size: <strong className="text-[#252525] font-medium">{item.size}</strong></span>
                    <span>•</span>
                    <span>Color: <strong className="text-[#252525] font-medium">{item.colorName}</strong></span>
                  </div>
                  <div className="text-sm font-bold text-[#252525] pt-1">
                    {formatPrice(item.price)}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start pt-2 sm:pt-0">
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => updateQuantity(item.variantId, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                  />
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="p-2 text-[#252525]/60 hover:text-red-700 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Summary and Checkout */}
          <div className="lg:col-span-4 space-y-4">
            <PriceSummary
              subtotal={cartTotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />

            <Link href="/checkout" className="block w-full">
              <Button size="lg" className="w-full flex items-center justify-center gap-2.5">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <p className="text-center text-xs text-[#252525]/60 pt-2 font-light">
              Encrypted 256-bit SSL Checkout & Bespoke Client Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
