import React from 'react';
import Link from 'next/link';
import CustomerHeader from '@/components/customer/CustomerHeader';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/currency';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage({ params }) {
  const orderId = params.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/account/orders" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      <CustomerHeader
        title={`Order ${orderId}`}
        subtitle="Snapshot invoice breakdown and purchase receipt."
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="text-xs text-slate-400">Order Reference</div>
            <div className="font-mono text-lg font-bold text-slate-900">{orderId}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Fulfillment Status</div>
            <Badge variant="warning">In Transit</Badge>
          </div>
          <div>
            <div className="text-xs text-slate-400">Payment Status</div>
            <Badge variant="success">PAID (Credit Card)</Badge>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Purchased Apparel
          </h3>
          <div className="border border-slate-100 rounded-lg p-4 flex justify-between items-center bg-slate-50">
            <div>
              <div className="font-semibold text-sm text-slate-900">
                Merino Wool Minimalist Trench Coat
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Size: <strong>M</strong> • Color: <strong>Camel</strong> • Qty: <strong>1</strong>
              </div>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {formatCurrency(285.00)}
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="border-t border-slate-100 pt-4 flex flex-col items-end text-sm space-y-1.5 text-slate-600">
          <div className="w-64 flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(285.00)}</span>
          </div>
          <div className="w-64 flex justify-between">
            <span>Shipping:</span>
            <span>Complimentary</span>
          </div>
          <div className="w-64 flex justify-between">
            <span>Estimated Tax:</span>
            <span>{formatCurrency(22.80)}</span>
          </div>
          <div className="w-64 flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 text-base">
            <span>Total Paid:</span>
            <span>{formatCurrency(307.80)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
