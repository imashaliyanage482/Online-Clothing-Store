import React from 'react';
import Link from 'next/link';
import CustomerHeader from '@/components/customer/CustomerHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/currency';

const orders = [
  {
    id: 'FS-2026-98124',
    date: 'Oct 24, 2026',
    status: 'SHIPPED',
    total: 322.80,
    itemCount: 1,
    title: 'Merino Wool Minimalist Trench Coat',
  },
  {
    id: 'FS-2026-88019',
    date: 'Sep 12, 2026',
    status: 'DELIVERED',
    total: 129.60,
    itemCount: 1,
    title: 'Relaxed Fit Heavyweight Cotton Overshirt',
  },
];

export default function CustomerOrdersPage() {
  return (
    <div className="space-y-6">
      <CustomerHeader
        title="My Orders"
        subtitle="Review your purchase history and track current fulfillment status."
      />

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-bold text-slate-900">{order.id}</span>
                <Badge variant={order.status === 'DELIVERED' ? 'success' : 'warning'}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">{order.title} ({order.itemCount} item)</p>
              <div className="text-xs text-slate-400">
                Ordered on {order.date} • Total: <strong className="text-slate-800">{formatCurrency(order.total)}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/account/orders/${order.id}`}>
                <Button size="sm" variant="outline">
                  Invoice
                </Button>
              </Link>
              <Link href={`/account/orders/${order.id}/track`}>
                <Button size="sm">
                  Track
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
