'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/customer/CustomerHeader';
import { formatCurrency } from '@/lib/utils/currency';
import {
  Package,
  ShoppingBag,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Truck,
  Sparkles,
  User,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCustomerOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed fetching customer orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();

    // Check wishlist items from localStorage
    try {
      const savedWishlist = localStorage.getItem('fashionstore_wishlist');
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) {
          setWishlistCount(parsed.length);
        }
      }
    } catch {
      setWishlistCount(0);
    }
  }, []);

  // Compute Metrics
  const totalOrdersCount = orders.length;
  const totalSpent = orders.reduce((sum, o) => {
    if (o.status === 'CANCELLED' || o.fulfillmentStatus === 'CANCELLED') return sum;
    return sum + (Number(o.totalAmount) || 0);
  }, 0);

  const activeOrders = orders.filter(
    (o) =>
      o.fulfillmentStatus !== 'DELIVERED' &&
      o.fulfillmentStatus !== 'CANCELLED' &&
      o.status !== 'CANCELLED'
  );
  const activeOrdersCount = activeOrders.length;

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
    <div className="space-y-8 text-[#252525] max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#B69A7A]/30">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-1">
            CLIENT ATELIER
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
            Welcome, {user?.name || 'Customer'}
          </h1>
          <p className="text-xs text-[#252525]/70 mt-1 font-light">
            Review your placed orders, tracking updates, and manage your luxury customer preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/account/profile"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#B69A7A]/40 rounded-xl text-xs font-semibold text-[#252525] hover:bg-[#FAF7F2] transition-colors shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-[#B69A7A]" />
            <span>My Profile</span>
          </Link>

          <Link
            href="/women"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#252525] hover:bg-[#3d3d3d] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B69A7A]" />
            <span>Shop New Arrivals</span>
          </Link>
        </div>
      </div>

      {/* ── COLORFUL METRIC KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Spend Card (Emerald) */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Total Spend
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-100/80 text-emerald-700">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-emerald-950 sm:text-3xl">
            {formatCurrency(totalSpent)}
          </div>
          <p className="mt-1 text-[11px] text-emerald-800/70">
            Cumulative atelier purchases
          </p>
        </div>

        {/* Total Orders Card (Sky Blue) */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-sky-50/40 p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
              Total Orders
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100/80 text-sky-700">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-sky-950 sm:text-3xl">
            {totalOrdersCount}
          </div>
          <p className="mt-1 text-[11px] text-sky-800/70">
            Total placed orders with invoice
          </p>
        </div>

        {/* Active Orders Card (Amber Orange) */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Active Shipments
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-100/80 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-amber-950 sm:text-3xl">
            {activeOrdersCount}
          </div>
          <p className="mt-1 text-[11px] text-amber-800/70">
            Processing or in transit to you
          </p>
        </div>

        {/* Wishlist Card (Rose Pink) */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-50/40 p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              Saved Wishlist
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-100/80 text-rose-700">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-rose-950 sm:text-3xl">
            {wishlistCount}
          </div>
          <p className="mt-1 text-[11px] text-rose-800/70">
            Loved pieces saved for future purchase
          </p>
        </div>
      </div>

      {/* ── ALL CUSTOMER ORDERS SECTION ── */}
      <section className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:px-6 border-b border-[#B69A7A]/25">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#B69A7A]" />
            <h2 className="font-serif text-lg font-bold text-[#252525]">
              My Orders & Live Tracking
            </h2>
            <span className="rounded-full bg-[#B69A7A]/20 px-2.5 py-0.5 text-xs font-bold text-[#252525]">
              {orders.length}
            </span>
          </div>

          <button
            onClick={fetchCustomerOrders}
            disabled={loadingOrders}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B69A7A] hover:text-[#252525] transition-colors disabled:opacity-50 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
            <span>Refresh Orders</span>
          </button>
        </div>

        {loadingOrders ? (
          <div className="p-12 text-center text-xs text-[#252525]/60">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B69A7A] mb-2" />
            Loading your order records…
          </div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-[#B69A7A]/20">
            {orders.map((order) => {
              const status = order.fulfillmentStatus || order.status || 'PENDING';
              const paymentStatus = order.paymentStatus || 'PAID';
              const items = order.items || [];
              const itemsCount = items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);

              return (
                <div key={order.id} className="p-5 sm:p-6 hover:bg-white/50 transition-colors space-y-4">
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#B69A7A]/15">
                    <div>
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

                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            paymentStatus === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          Payment: {paymentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-[#252525]/60 mt-1 font-light">
                        Placed on {formatDate(order.createdAt)} • {itemsCount} garment(s)
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="px-3.5 py-1.5 rounded-xl border border-[#B69A7A]/40 bg-white text-xs font-semibold text-[#252525] hover:bg-[#FAF7F2] transition-colors shadow-sm"
                      >
                        View Invoice
                      </Link>
                      <Link
                        href={`/account/orders/${order.id}/track`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#252525] text-xs font-semibold text-white hover:bg-[#3d3d3d] transition-colors shadow-sm"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#B69A7A]" />
                        <span>Track Parcel</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 text-[#252525]/85"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#252525]">
                            {item.quantity || 1}x
                          </span>
                          <span>{item.title}</span>
                          {(item.size || item.color) && (
                            <span className="text-[11px] text-[#252525]/60">
                              ({[item.size, item.color].filter(Boolean).join(', ')})
                            </span>
                          )}
                        </div>
                        <span className="font-bold font-mono">
                          {formatCurrency(Number(item.price) * (Number(item.quantity) || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total Footer */}
                  <div className="pt-3 border-t border-[#B69A7A]/15 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 text-[#252525]/70">
                    <div>
                      {order.shippingAddress && (
                        <span>
                          Delivering to: <strong className="text-[#252525]">{order.shippingAddress}</strong>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Delivery: {formatCurrency(order.shippingFee ?? 450)}</span>
                      <span className="text-sm font-bold text-[#252525]">
                        Grand Total: {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-[#B69A7A]/60 mx-auto" />
            <h3 className="font-serif text-base font-bold text-[#252525]">No Orders Placed Yet</h3>
            <p className="text-xs text-[#252525]/65 max-w-sm mx-auto font-light">
              Your atelier wardrobe archive is currently empty. Explore our curated collections and place your first order.
            </p>
            <div className="pt-2">
              <Link
                href="/collections/best-sellers"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-[#3d3d3d] transition-colors shadow-sm"
              >
                <span>Explore Best Sellers</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B69A7A]" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
