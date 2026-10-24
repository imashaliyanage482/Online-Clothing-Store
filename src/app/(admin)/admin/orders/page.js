import React from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/currency';

const orders = [
  { id: 'FS-2026-98124', customer: 'Jane Doe', items: 1, total: 285.00, status: 'SHIPPED', date: 'Oct 24, 2026' },
  { id: 'FS-2026-98123', customer: 'Michael Chen', items: 3, total: 420.50, status: 'PROCESSING', date: 'Oct 24, 2026' },
  { id: 'FS-2026-98122', customer: 'Sarah Jenkins', items: 2, total: 215.00, status: 'DELIVERED', date: 'Oct 23, 2026' },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Customer Orders & Dispatch"
        description="Review incoming orders, transition fulfillment statuses, and issue shipping labels."
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{ord.id}</td>
                <td className="px-6 py-4">{ord.customer}</td>
                <td className="px-6 py-4 text-xs">{ord.date}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(ord.total)}</td>
                <td className="px-6 py-4">
                  <Badge variant={ord.status === 'DELIVERED' ? 'success' : ord.status === 'SHIPPED' ? 'warning' : 'info'}>
                    {ord.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/orders/${ord.id}`} className="text-xs font-bold text-amber-600 hover:text-amber-700">
                    Fulfill &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
