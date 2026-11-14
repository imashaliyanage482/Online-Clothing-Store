'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import PriceSummary from '@/components/shop/PriceSummary';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { citiesByProvince, getDeliveryFee, getProvinceForCity } from '@/lib/orders/delivery';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { settings, formatPrice } = useCurrency();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: user?.name || '',
    email: user?.email || '',
    streetAddress: '',
    city: '',
    state: '',
    phone: '',
    paymentMethod: 'CREDIT_CARD',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      recipientName: current.recipientName || user.name || '',
      email: user.email || current.email,
    }));
  }, [user]);

  const shipping = getDeliveryFee(formData.city, formData.state);
  const tax = 0;
  const total = cartTotal + shipping;
  const provinceOptions = Object.keys(citiesByProvince);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === 'CREDIT_CARD') {
      const cleanNumber = cardData.cardNumber.replace(/\s/g, '');
      if (cleanNumber.length < 15) {
        alert('Please enter a valid 16-digit credit/debit card number.');
        return;
      }
      if (!cardData.cardholderName.trim()) {
        alert('Please enter the cardholder name.');
        return;
      }
      if (!cardData.expiryDate || cardData.expiryDate.length < 5) {
        alert('Please enter a valid card expiry date (MM / YY).');
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        alert('Please enter a valid 3 or 4 digit CVV/CVC code.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.recipientName,
          customerEmail: formData.email,
          customerPhone: formData.phone || '',
          streetAddress: formData.streetAddress,
          city: formData.city,
          province: formData.state,
          items: cart.map((item) => ({
            id: item.variantId || item.id,
            productId: item.productId || item.id,
            productTitle: item.title,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.colorName,
            image: item.image,
          })),
          subtotal: cartTotal,
          discountAmount: 0,
          shippingFee: shipping,
          totalAmount: total,
          paymentMethod: formData.paymentMethod,
          paymentStatus: formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'UNPAID' : 'PAID',
          status: 'PENDING',
        }),
      });

      const data = await res.json();
      if (res.ok && data.order && data.receiptToken) {
        clearCart();
        router.push(
          `/checkout/success?orderId=${encodeURIComponent(data.order.id)}&key=${encodeURIComponent(data.receiptToken)}`
        );
      } else {
        throw new Error(data.error || 'Failed to place order');
      }
    } catch (err) {
      alert(err.message || 'Error completing checkout. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase block mb-2">
            FINAL VERIFICATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#252525] mb-10">
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Shipping Address & Payment Selection */}
          <div className="lg:col-span-8 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 sm:p-8 space-y-7 shadow-sm">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#252525] uppercase tracking-wider mb-5">
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
                    placeholder="124 Fifth Avenue"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    label="City"
                    required
                    list="sri-lankan-cities"
                    value={formData.city}
                    onChange={(e) => {
                      const city = e.target.value;
                      setFormData({
                        ...formData,
                        city,
                        state: getProvinceForCity(city),
                      });
                    }}
                  />
                  <datalist id="sri-lankan-cities">
                    {Object.values(citiesByProvince).flat().map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label
                    htmlFor="checkout-province"
                    className="block text-xs font-semibold text-[#252525] uppercase tracking-wider mb-1.5"
                  >
                    State / Province
                  </label>
                  <select
                    id="checkout-province"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#252525] bg-[#FAF7F2] border-[#B69A7A]/40 focus:outline-none focus:ring-1 focus:ring-[#B69A7A] focus:border-[#B69A7A]"
                  >
                    <option value="">Select province</option>
                    {provinceOptions.map((province) => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 bg-[#F5F0E8] border border-[#B69A7A]/35 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase tracking-wider text-[#B69A7A]">Delivery Charge:</span>
                    <span className="text-[#252525]">
                      {formData.state === 'Western Province' || getProvinceForCity(formData.city) === 'Western Province'
                        ? 'Western Province • Rs. 350'
                        : formData.state || formData.city
                        ? `${formData.state || getProvinceForCity(formData.city)} • Rs. 450`
                        : 'Western Province: Rs. 350 | Other Provinces: Rs. 450'}
                    </span>
                  </div>
                  <span className="font-bold text-sm text-[#252525]">
                    {formatPrice(shipping)}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-6 border-t border-[#B69A7A]/25">
              <h2 className="font-serif text-lg font-bold text-[#252525] uppercase tracking-wider mb-5">
                2. Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  formData.paymentMethod === 'CREDIT_CARD'
                    ? 'border-[#252525] bg-[#F5F0E8] text-[#252525] shadow-sm'
                    : 'border-[#B69A7A]/30 bg-[#FAF7F2] text-[#252525]/80 hover:border-[#B69A7A]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CREDIT_CARD"
                    checked={formData.paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'CREDIT_CARD' })}
                    className="accent-[#252525]"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider">Credit / Debit Card</span>
                </label>

                <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  formData.paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-[#252525] bg-[#F5F0E8] text-[#252525] shadow-sm'
                    : 'border-[#B69A7A]/30 bg-[#FAF7F2] text-[#252525]/80 hover:border-[#B69A7A]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'CASH_ON_DELIVERY' })}
                    className="accent-[#252525]"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider">Pay on Delivery</span>
                </label>
              </div>

              {/* Credit / Debit Card Form */}
              {formData.paymentMethod === 'CREDIT_CARD' && (
                <div className="mt-5 p-5 sm:p-6 rounded-2xl border border-[#B69A7A]/40 bg-[#F5F0E8] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#B69A7A]/25 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#252525]">
                      <CreditCard className="w-4 h-4 text-[#B69A7A]" />
                      <span>Card Details</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>256-Bit SSL Secured</span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required={formData.paymentMethod === 'CREDIT_CARD'}
                          placeholder="0000 0000 0000 0000"
                          value={cardData.cardNumber}
                          onChange={(e) => {
                            const formatted = e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 16)
                              .replace(/(\d{4})(?=\d)/g, '$1 ');
                            setCardData({ ...cardData, cardNumber: formatted });
                          }}
                          className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3.5 py-2.5 text-sm font-mono tracking-wider text-[#252525] outline-none focus:border-[#252525] focus:ring-1 focus:ring-[#252525]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            VISA
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            MC
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                        Cardholder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={formData.paymentMethod === 'CREDIT_CARD'}
                        placeholder="NAME ON CARD"
                        value={cardData.cardholderName}
                        onChange={(e) =>
                          setCardData({ ...cardData, cardholderName: e.target.value.toUpperCase() })
                        }
                        className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3.5 py-2.5 text-sm uppercase text-[#252525] outline-none focus:border-[#252525] focus:ring-1 focus:ring-[#252525]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={formData.paymentMethod === 'CREDIT_CARD'}
                          placeholder="MM / YY"
                          value={cardData.expiryDate}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            const formatted = val.length >= 3 ? `${val.slice(0, 2)} / ${val.slice(2)}` : val;
                            setCardData({ ...cardData, expiryDate: formatted });
                          }}
                          className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3.5 py-2.5 text-sm font-mono text-center text-[#252525] outline-none focus:border-[#252525] focus:ring-1 focus:ring-[#252525]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                          CVV / CVC <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          required={formData.paymentMethod === 'CREDIT_CARD'}
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => {
                            const formatted = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setCardData({ ...cardData, cvv: formatted });
                          }}
                          className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3.5 py-2.5 text-sm font-mono text-center text-[#252525] outline-none focus:border-[#252525] focus:ring-1 focus:ring-[#252525]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#252525] border-b border-[#B69A7A]/25 pb-3">
                Your Items
              </h3>
              {cart.map((item) => (
                <div key={item.variantId || item.id} className="flex justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-[#252525] truncate">{item.title}</p>
                    <p className="text-xs text-[#252525]/65">
                      {[item.size, item.colorName, `Qty ${item.quantity}`].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-xs text-[#252525]/65">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <PriceSummary
              subtotal={cartTotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Placing Your Order...' : `Place Order · ${formatPrice(total)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
