import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';

export default function PriceSummary({
  subtotal = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  total = 0,
}) {
  const { currencyCode, formatPrice } = useCurrency();

  return (
    <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 sm:p-8 space-y-5">
      <h3 className="font-serif text-lg font-bold text-[#252525] border-b border-[#B69A7A]/25 pb-3">
        Order Summary
      </h3>
      <div className="space-y-3 text-sm text-[#252525]/80 font-light">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-[#252525]">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[#B69A7A] font-medium">
            <span>Privilege Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="font-medium text-[#252525]">
            {shipping === null ? 'Calculated at checkout' : shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
          </span>
        </div>
      </div>
      <div className="border-t border-[#B69A7A]/25 pt-4 flex justify-between items-center text-base font-bold text-[#252525]">
        <span>Total</span>
        <span className="text-lg">{formatPrice(total)}</span>
      </div>
      {currencyCode === 'USD' && (
        <p className="text-[11px] text-[#252525]/60">
          USD display is converted from LKR at the store&apos;s current exchange rate.
        </p>
      )}
    </div>
  );
}
