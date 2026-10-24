import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CheckCircle2, PackageCheck } from 'lucide-react';

export default function CheckoutSuccessPage({ searchParams }) {
  const orderId = searchParams?.orderId || 'FS-2026-98124';

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Payment & Order Confirmed
        </span>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Thank You for Your Order!</h1>
        <p className="mt-2 text-sm text-slate-500">
          We have received your apparel order and our logistics team is preparing it for fulfillment.
        </p>

        <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Order Reference:</span>
            <strong className="text-slate-900 font-mono">{orderId}</strong>
          </div>
          <div className="flex justify-between">
            <span>Estimated Dispatch:</span>
            <strong className="text-slate-900">Within 24-48 Hours</strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
              <PackageCheck className="w-4 h-4" />
              <span>Track in Account</span>
            </Button>
          </Link>
          <Link href="/products">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
