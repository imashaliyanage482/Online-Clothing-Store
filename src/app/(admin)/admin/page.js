import React from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import Badge from '@/components/ui/Badge';
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Revenue', value: formatCurrency(48290.00), change: '+14.2%', icon: DollarSign, isPositive: true },
    { title: 'Orders Placed', value: '184', change: '+8.1%', icon: ShoppingBag, isPositive: true },
    { title: 'Active Customers', value: '1,240', change: '+5.4%', icon: Users, isPositive: true },
    { title: 'Low Stock SKUs', value: '3', change: 'Needs Restock', icon: AlertTriangle, isPositive: false },
  ];

  const recentOrders = [
    { id: 'FS-2026-98124', customer: 'Jane Doe', items: 1, total: 285.00, status: 'SHIPPED', date: 'Oct 24, 2026' },
    { id: 'FS-2026-98123', customer: 'Michael Chen', items: 3, total: 420.50, status: 'PROCESSING', date: 'Oct 24, 2026' },
    { id: 'FS-2026-98122', customer: 'Sarah Jenkins', items: 2, total: 215.00, status: 'DELIVERED', date: 'Oct 23, 2026' },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Store Operations Overview"
        description="Daily sales metrics, dispatch queues, and SKU inventory indicators."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <StatCard key={idx} {...s} />
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
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
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{ord.id}</td>
                  <td className="px-6 py-4">{ord.customer}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{ord.date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(ord.total)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={ord.status === 'DELIVERED' ? 'success' : ord.status === 'SHIPPED' ? 'warning' : 'info'}>
                      {ord.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${ord.id}`} className="text-xs font-bold text-amber-600 hover:text-amber-700">
                      Manage &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
