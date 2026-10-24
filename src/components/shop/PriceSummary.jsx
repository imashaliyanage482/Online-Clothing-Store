import React from 'react';
import { formatCurrency } from '@/lib/utils/currency';

export default function PriceSummary({
  subtotal = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  total = 0,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
        Order Summary
      </h3>
      <div className="space-y-2.5 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount Applied</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Standard Delivery</span>
          <span className="font-medium text-slate-900">
            {shipping === 0 ? 'Complimentary' : formatCurrency(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Sales Tax</span>
          <span className="font-medium text-slate-900">{formatCurrency(tax)}</span>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-base font-bold text-slate-900">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
