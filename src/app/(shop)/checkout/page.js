'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import PriceSummary from '@/components/shop/PriceSummary';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: user?.name || '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'CREDIT_CARD',
  });

  const shipping = cartTotal > 150 ? 0 : 15;
  const tax = Number((cartTotal * 0.08).toFixed(2));
  const total = cartTotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate order placement
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success?orderId=FS-2026-98124');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Secure Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Shipping Address & Payment Selection */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
              1. Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Full Recipient Name"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                />
              </div>
              <div>
                <Input
                  label="Apt / Suite / Unit (Optional)"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                />
              </div>
              <div>
                <Input
                  label="City"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Input
                  label="State / Province"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <Input
                  label="Postal Code"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
              2. Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CREDIT_CARD"
                  defaultChecked
                  className="text-slate-900 focus:ring-slate-900"
                />
                <span className="text-sm font-semibold text-slate-800">Credit / Debit Card (Stripe Gateway)</span>
              </label>
              <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  className="text-slate-900 focus:ring-slate-900"
                />
                <span className="text-sm font-semibold text-slate-800">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
          </Button>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-4">
          <PriceSummary
            subtotal={cartTotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </form>
    </div>
  );
}
