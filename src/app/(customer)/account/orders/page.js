'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerHeader from '@/components/customer/CustomerHeader';
import { formatCurrency } from '@/lib/utils/currency';
import { Package, ArrowRight, RefreshCw, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return Number.isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString('en-LK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CustomerHeader
          title="My Orders"
          subtitle="Review your atelier purchase history and track current fulfillment status."
        />

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#B69A7A]/40 rounded-xl text-xs font-semibold text-[#252525] hover:bg-[#FAF7F2] transition-colors shadow-sm self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#B69A7A]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#252525]/60 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B69A7A] mb-2" />
          Loading your order history…
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = order.fulfillmentStatus || order.status || 'PENDING';
            const items = order.items || [];
            const itemsCount = items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
            const firstTitle = items[0]?.title || 'Atelier Garment';

            return (
              <div
                key={order.id}
                className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm hover:shadow transition-shadow"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#252525]">
                      #{order.id}
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : status === 'SHIPPED'
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-[#252525]/80 font-medium">
                    {firstTitle} {itemsCount > 1 && `+ ${itemsCount - 1} more item(s)`}
                  </p>
                  <div className="text-xs text-[#252525]/60 font-light">
                    Ordered on {formatDate(order.createdAt)} • Total:{' '}
                    <strong className="text-[#252525] font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link href={`/account/orders/${order.id}`} className="flex-1 sm:flex-none">
                    <button className="w-full px-4 py-2 rounded-xl border border-[#B69A7A]/40 bg-white text-xs font-semibold text-[#252525] hover:bg-[#FAF7F2] transition-colors shadow-sm">
                      Invoice
                    </button>
                  </Link>
                  <Link href={`/account/orders/${order.id}/track`} className="flex-1 sm:flex-none">
                    <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#252525] text-xs font-semibold text-white hover:bg-[#3d3d3d] transition-colors shadow-sm">
                      <Truck className="w-3.5 h-3.5 text-[#B69A7A]" />
                      <span>Track</span>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center space-y-3 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30">
          <Package className="w-10 h-10 text-[#B69A7A]/60 mx-auto" />
          <h3 className="font-serif text-base font-bold text-[#252525]">No Orders Placed Yet</h3>
          <p className="text-xs text-[#252525]/65 max-w-sm mx-auto font-light">
            You haven&apos;t placed any orders yet. Discover our latest collections and start your wardrobe edit.
          </p>
          <div className="pt-2">
            <Link
              href="/women"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-[#3d3d3d] transition-colors shadow-sm"
            >
              <span>Explore Women&apos;s Collection</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B69A7A]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
