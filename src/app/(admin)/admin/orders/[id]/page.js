'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Trash2, CheckCircle, Save } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENT_STATUSES = ['UNPAID', 'PAID', 'REFUNDED'];

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-LK');
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [editData, setEditData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    shippingFee: 0,
  });

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load this order.');
      setOrder(data.order);
      setEditData({
        customerName: data.order.customerName || '',
        customerEmail: data.order.customerEmail || '',
        customerPhone: data.order.customerPhone || '',
        shippingAddress: data.order.shippingAddress || '',
        status: data.order.status || 'PENDING',
        paymentStatus: data.order.paymentStatus || 'UNPAID',
        shippingFee: data.order.shippingFee ?? 0,
      });
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load this order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleSaveDetails = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editData.status,
          paymentStatus: editData.paymentStatus,
          customerName: editData.customerName,
          customerEmail: editData.customerEmail,
          customerPhone: editData.customerPhone,
          shippingAddress: editData.shippingAddress,
          shippingFee: Number(editData.shippingFee) || 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update order details.');
      setOrder(data.order);
      setMessage('Order details updated and saved successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to update order details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete order ${order?.orderNumber || orderId}? This cannot be undone.`)) {
      return;
    }
    setDeleting(true);
    setError('');
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete order.');
      router.push('/admin/orders');
    } catch (delError) {
      setError(delError.message || 'Failed to delete order.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-xs text-[#252525]/60">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin text-[#B69A7A]" />
        Loading order details…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A6E51] hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Orders
        </Link>
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {error || 'Order not found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A6E51] hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Orders
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{deleting ? 'Deleting…' : 'Delete Order'}</span>
        </button>
      </div>

      <header className="border-b border-[#B69A7A]/30 pb-4">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B69A7A]">
          EDIT ORDER DETAILS
        </span>
        <h1 className="font-serif text-2xl font-bold text-[#252525] sm:text-3xl">
          {order.orderNumber || order.id}
        </h1>
        <p className="mt-1 text-xs text-[#252525]/65">Placed {formatDate(order.createdAt)}</p>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{message}</p>}

      <form onSubmit={handleSaveDetails} className="space-y-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Left Column: Items & Editable Customer Details */}
          <div className="space-y-5">
            {/* Customer Details Editable Section */}
            <section className="rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 shadow-sm sm:p-6 space-y-4">
              <h2 className="font-serif text-base font-bold text-[#252525] border-b border-[#B69A7A]/25 pb-2">
                Customer & Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editData.customerName}
                    onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                    className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3 py-2 text-xs text-[#252525] outline-none focus:border-[#252525]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editData.customerEmail}
                    onChange={(e) => setEditData({ ...editData, customerEmail: e.target.value })}
                    className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3 py-2 text-xs text-[#252525] outline-none focus:border-[#252525]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={editData.customerPhone}
                    onChange={(e) => setEditData({ ...editData, customerPhone: e.target.value })}
                    className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3 py-2 text-xs text-[#252525] outline-none focus:border-[#252525]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                    Shipping Fee (LKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editData.shippingFee}
                    onChange={(e) => setEditData({ ...editData, shippingFee: e.target.value })}
                    className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3 py-2 text-xs text-[#252525] outline-none focus:border-[#252525]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    rows={2}
                    value={editData.shippingAddress}
                    onChange={(e) => setEditData({ ...editData, shippingAddress: e.target.value })}
                    className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3 py-2 text-xs text-[#252525] outline-none focus:border-[#252525]"
                  />
                </div>
              </div>
            </section>

            {/* Order Items */}
            <section className="rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 shadow-sm sm:p-6">
              <h2 className="font-serif text-base font-bold text-[#252525] border-b border-[#B69A7A]/25 pb-2">
                Order Items ({order.items?.length || 0})
              </h2>
              <div className="mt-3 divide-y divide-[#B69A7A]/20">
                {(order.items || []).map((item, index) => (
                  <div key={item.id || `${item.productId}-${index}`} className="flex justify-between gap-4 py-3 text-xs">
                    <div>
                      <p className="font-semibold text-[#252525]">{item.productTitle || item.title || 'Product'}</p>
                      <p className="mt-0.5 text-[#252525]/60">
                        {[item.size, item.color].filter(Boolean).join(' · ') || 'Standard'} · Qty {item.quantity || 1}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold">{formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 1))}</p>
                  </div>
                ))}
              </div>

              <dl className="ml-auto mt-4 max-w-xs space-y-2 border-t border-[#B69A7A]/25 pt-4 text-xs">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt>Discount</dt><dd>{formatCurrency(order.discountAmount)}</dd></div>
                <div className="flex justify-between"><dt>Shipping</dt><dd>{formatCurrency(editData.shippingFee)}</dd></div>
                <div className="flex justify-between border-t border-[#B69A7A]/25 pt-2 text-sm font-bold">
                  <dt>Total</dt>
                  <dd>{formatCurrency((Number(order.subtotal) || 0) - (Number(order.discountAmount) || 0) + (Number(editData.shippingFee) || 0))}</dd>
                </div>
              </dl>
            </section>
          </div>

          {/* Right Column: Status & Save Controls */}
          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 shadow-sm space-y-4">
              <h2 className="font-serif text-base font-bold text-[#252525] border-b border-[#B69A7A]/25 pb-2">
                Status Settings
              </h2>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3 py-2.5 text-xs font-semibold text-[#252525] outline-none focus:border-[#252525]"
                >
                  {STATUSES.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#252525] mb-1">
                  Payment Status
                </label>
                <select
                  value={editData.paymentStatus}
                  onChange={(e) => setEditData({ ...editData, paymentStatus: e.target.value })}
                  className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3 py-2.5 text-xs font-semibold text-[#252525] outline-none focus:border-[#252525]"
                >
                  {PAYMENT_STATUSES.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-[#252525]/60 pt-1">
                Payment Method: <span className="font-semibold text-[#252525]">{order.paymentMethod || 'CASH_ON_DELIVERY'}</span>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 rounded-xl bg-[#252525] py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#F5F0E8] transition-all hover:bg-[#B69A7A] hover:text-[#252525] disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes…' : 'Save Order Details'}</span>
              </button>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}
