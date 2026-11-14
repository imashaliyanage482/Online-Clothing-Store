'use client';

import React from 'react';
import Link from 'next/link';
import CustomerHeader from '@/components/customer/CustomerHeader';
import Badge from '@/components/ui/Badge';
import { useCurrency } from '@/context/CurrencyContext';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage({ params }) {
  const { formatPrice } = useCurrency();
  const orderId = params.id;

  return (
    <div className="space-y-6 text-[#252525]">
      <div className="flex items-center gap-2">
        <Link
          href="/account/orders"
          className="text-xs text-[#252525]/70 hover:text-[#252525] flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      <CustomerHeader
        title={`Order ${orderId}`}
        subtitle="Snapshot invoice breakdown and purchase receipt."
      />

      <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-[#B69A7A]/25 gap-4">
          <div>
            <div className="text-xs text-[#252525]/60">Order Reference</div>
            <div className="font-mono text-lg font-bold text-[#252525]">{orderId}</div>
          </div>
          <div>
            <div className="text-xs text-[#252525]/60">Fulfillment Status</div>
            <Badge variant="warning">In Transit</Badge>
          </div>
          <div>
            <div className="text-xs text-[#252525]/60">Payment Status</div>
            <Badge variant="success">PAID (Credit Card)</Badge>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
            Purchased Apparel
          </h3>
          <div className="border border-[#B69A7A]/25 rounded-xl p-4 flex justify-between items-center bg-[#F5F0E8]">
            <div>
              <div className="font-serif font-semibold text-sm sm:text-base text-[#252525]">
                Merino Wool Minimalist Trench Coat
              </div>
              <div className="text-xs text-[#252525]/70 mt-1 font-light">
                Size: <strong className="font-medium text-[#252525]">M</strong> • Color:{' '}
                <strong className="font-medium text-[#252525]">Camel</strong> • Qty:{' '}
                <strong className="font-medium text-[#252525]">1</strong>
              </div>
            </div>
            <div className="text-sm font-bold text-[#252525]">
              {formatPrice(28500)}
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-[#B69A7A]/25 space-y-2 text-xs text-[#252525]/80 font-light max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-[#252525]">{formatPrice(28500)}</span>
          </div>
          <div className="flex justify-between">
            <span>Complimentary Delivery</span>
            <span className="font-medium text-[#252525]">{formatPrice(0)}</span>
          </div>
          <div className="flex justify-between border-t border-[#B69A7A]/25 pt-2 text-sm font-bold text-[#252525]">
            <span>Total Paid</span>
            <span>{formatPrice(28500)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
