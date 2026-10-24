'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils/currency';
import QuantitySelector from '@/components/shop/QuantitySelector';
import PriceSummary from '@/components/shop/PriceSummary';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="Looks like you haven't added any clothing pieces to your shopping bag yet."
          actionLabel="Explore New Arrivals"
          actionHref="/products"
        />
      </div>
    );
  }

  const shipping = cartTotal > 150 ? 0 : 15;
  const tax = Number((cartTotal * 0.08).toFixed(2));
  const total = cartTotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {cart.map((item) => (
            <div key={item.variantId} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <div className="text-xs text-slate-500 space-x-2">
                  <span>Size: <strong className="text-slate-800">{item.size}</strong></span>
                  <span>•</span>
                  <span>Color: <strong className="text-slate-800">{item.colorName}</strong></span>
                </div>
                <div className="text-sm font-bold text-slate-900 pt-1">
                  {formatCurrency(item.price)}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.variantId, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.variantId, item.quantity - 1)}
                />
                <button
                  onClick={() => removeFromCart(item.variantId)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <PriceSummary
            subtotal={cartTotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
          <Link href="/checkout" className="block">
            <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
