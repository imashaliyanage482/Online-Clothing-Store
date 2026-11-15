'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

const STATUSES = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusStyle(status) {
  if (status === 'DELIVERED' || status === 'PAID') return 'bg-emerald-100 text-emerald-800';
  if (status === 'CANCELLED' || status === 'FAILED') return 'bg-red-100 text-red-800';
  if (status === 'SHIPPED' || status === 'PROCESSING') return 'bg-sky-100 text-sky-800';
  return 'bg-amber-100 text-amber-800';
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchOrders = async (forceSync = true) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(forceSync ? '/api/orders?sync=true' : '/api/orders');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load orders.');
      setOrders(data.orders || []);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesQuery =
        !search ||
        [order.orderNumber, order.id, order.customerName, order.customerEmail]
          .some((value) => String(value || '').toLowerCase().includes(search));
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update order status.');
      setOrders((current) => current.map((order) => order.id === orderId ? data.order : order));
      setMessage(`Order ${data.order.orderNumber || orderId} updated to ${status}.`);
    } catch (updateError) {
      setError(updateError.message || 'Unable to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderNumber || orderId}? This action cannot be undone.`)) {
      return;
    }

    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete order.');
      setOrders((current) => current.filter((order) => order.id !== orderId));
      setMessage(`Order ${orderNumber || orderId} was deleted successfully.`);
    } catch (delError) {
      setError(delError.message || 'Failed to delete order.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#B69A7A]/30 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B69A7A]">
            FULFILLMENT OPERATIONS
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#252525] sm:text-3xl">Orders</h1>
          <p className="mt-1 text-xs text-[#252525]/70">
            Review customer orders and update fulfillment status.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B69A7A]/40 bg-[#FAF7F2] px-4 py-2.5 text-xs font-semibold text-[#252525] shadow-sm transition-colors hover:bg-white disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#B69A7A]' : ''}`} />
          Refresh Orders
        </button>
      </header>

      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          {message}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#B69A7A]/25 p-4 sm:px-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#252525]">
            <ShoppingBag className="h-4 w-4 text-[#B69A7A]" />
            Order Queue
            <span className="rounded-full bg-[#B69A7A]/15 px-2 py-0.5 text-[10px] text-[#252525]/70">
              {orders.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {STATUSES.map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wide transition-colors ${
                    statusFilter === status
                      ? 'bg-[#252525] text-[#F5F0E8]'
                      : 'border border-[#B69A7A]/30 bg-white text-[#252525]/75 hover:bg-[#F5F0E8]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <label className="relative block w-full lg:max-w-xs">
              <span className="sr-only">Search orders</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#252525]/45" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search order or customer"
                className="w-full rounded-xl border border-[#B69A7A]/35 bg-white py-2.5 pl-9 pr-3 text-xs text-[#252525] outline-none focus:border-[#252525]"
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-xs text-[#252525]">
            <thead className="border-b border-[#B69A7A]/25 bg-[#F5F0E8] text-[10px] font-bold uppercase tracking-wider text-[#252525]/65">
              <tr>
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Fulfillment</th>
                <th className="px-5 py-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B69A7A]/20">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#252525]/60">
                    <RefreshCw className="mx-auto mb-2 h-5 w-5 animate-spin text-[#B69A7A]" />
                    Loading orders…
                  </td>
                </tr>
              ) : filteredOrders.length ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-white/60">
                    <td className="px-5 py-4 font-mono font-semibold">
                      {order.orderNumber || order.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold">{order.customerName || 'Customer'}</div>
                      <div className="mt-1 break-all text-[10px] text-[#252525]/55">{order.customerEmail}</div>
                    </td>
                    <td className="px-5 py-4">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">{order.items?.length || 0}</td>
                    <td className="px-5 py-4 font-semibold">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle(order.paymentStatus)}`}>
                        {order.paymentStatus || 'UNPAID'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        aria-label={`Fulfillment status for ${order.orderNumber || order.id}`}
                        value={order.status || 'PENDING'}
                        disabled={updatingId === order.id}
                        onChange={(event) => updateStatus(order.id, event.target.value)}
                        className={`rounded-lg border border-[#B69A7A]/30 px-2.5 py-1.5 text-[10px] font-semibold disabled:opacity-50 ${statusStyle(order.status)}`}
                      >
                        {STATUSES.filter((status) => status !== 'ALL').map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/orders/${encodeURIComponent(order.id)}`}
                          className="font-semibold text-[#8A6E51] hover:underline"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                          title="Delete Order"
                          aria-label={`Delete order ${order.orderNumber || order.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#252525]/60">
                    {query || statusFilter !== 'ALL' ? 'No orders match your filters.' : 'No orders found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
