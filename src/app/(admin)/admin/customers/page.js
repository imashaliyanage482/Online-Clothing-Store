import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { formatCurrency } from '@/lib/utils/currency';

const customers = [
  { id: 'usr-1', name: 'Jane Doe', email: 'customer@example.com', orders: 2, totalSpend: 452.40, joined: 'Jan 2026' },
  { id: 'usr-2', name: 'Michael Chen', email: 'm.chen@example.com', orders: 5, totalSpend: 1120.00, joined: 'Feb 2026' },
  { id: 'usr-3', name: 'Sarah Jenkins', email: 'sarah.j@example.com', orders: 1, totalSpend: 215.00, joined: 'Mar 2026' },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Customer Directory"
        description="View registered shoppers, transaction volume, and account activity."
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Customer Name</th>
              <th className="px-6 py-3">Email Address</th>
              <th className="px-6 py-3">Orders</th>
              <th className="px-6 py-3">Lifetime Spend</th>
              <th className="px-6 py-3">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                <td className="px-6 py-4 text-xs">{c.email}</td>
                <td className="px-6 py-4 font-mono text-xs">{c.orders} orders</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(c.totalSpend)}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
