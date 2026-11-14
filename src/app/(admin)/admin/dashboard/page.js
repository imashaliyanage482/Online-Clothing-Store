'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  DollarSign,
  RefreshCw,
  ShoppingBag,
  Shirt,
  Users,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30d');
  const [chartMetric, setChartMetric] = useState('revenue');

  const fetchStats = async () => {
    setLoading(true);
    setChartLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/stats?period=${period}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to retrieve dashboard statistics.');
      }
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setError('Dashboard analytics could not be loaded. Please try again.');
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  const trend = stats?.salesTrend || [];
  const chartValue = (bucket) => chartMetric === 'revenue' ? bucket.revenue : bucket.orders;
  const chartMax = Math.max(...trend.map(chartValue), 0);
  const chartTotal = trend.reduce((total, bucket) => total + chartValue(bucket), 0);

  const metrics = [
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : formatCurrency(0),
      caption: 'Revenue from non-cancelled orders',
      icon: DollarSign,
      cardBg: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-emerald-200 hover:border-emerald-400',
      titleColor: 'text-emerald-800',
      valueColor: 'text-emerald-950',
      captionColor: 'text-emerald-800/70',
      iconBadge: 'text-emerald-700 bg-emerald-100/90 border-emerald-300',
    },
    {
      title: 'Total Orders',
      value: stats ? stats.totalOrders : 0,
      caption: 'All customer orders',
      icon: ShoppingBag,
      cardBg: 'bg-gradient-to-br from-sky-50 via-white to-sky-50/50 border-sky-200 hover:border-sky-400',
      titleColor: 'text-sky-800',
      valueColor: 'text-sky-950',
      captionColor: 'text-sky-800/70',
      iconBadge: 'text-sky-700 bg-sky-100/90 border-sky-300',
      href: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats ? stats.pendingOrders : 0,
      caption: 'Awaiting fulfillment',
      icon: Clock3,
      cardBg: 'bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-amber-200 hover:border-amber-400',
      titleColor: 'text-amber-800',
      valueColor: 'text-amber-950',
      captionColor: 'text-amber-800/70',
      iconBadge: 'text-amber-700 bg-amber-100/90 border-amber-300',
      href: '/admin/orders',
    },
    {
      title: 'Total Customers',
      value: stats ? stats.totalCustomers : 0,
      caption: 'Registered customer accounts',
      icon: Users,
      cardBg: 'bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 border-indigo-200 hover:border-indigo-400',
      titleColor: 'text-indigo-800',
      valueColor: 'text-indigo-950',
      captionColor: 'text-indigo-800/70',
      iconBadge: 'text-indigo-700 bg-indigo-100/90 border-indigo-300',
      href: '/admin/customers',
    },
    {
      title: 'Total Garments',
      value: stats ? stats.totalProducts : 0,
      caption: 'Active catalog SKUs',
      icon: Shirt,
      cardBg: 'bg-gradient-to-br from-violet-50 via-white to-violet-50/50 border-violet-200 hover:border-violet-400',
      titleColor: 'text-violet-800',
      valueColor: 'text-violet-950',
      captionColor: 'text-violet-800/70',
      iconBadge: 'text-violet-700 bg-violet-100/90 border-violet-300',
      href: '/admin/products',
    },
    {
      title: 'Low Stock Warnings',
      value: stats ? stats.lowStockProducts : 0,
      caption: 'SKUs below threshold (<10)',
      icon: AlertTriangle,
      cardBg: 'bg-gradient-to-br from-rose-50 via-white to-rose-50/50 border-rose-200 hover:border-rose-400',
      titleColor: 'text-rose-800',
      valueColor: 'text-rose-950',
      captionColor: 'text-rose-800/70',
      iconBadge: 'text-rose-700 bg-rose-100/90 border-rose-300',
      href: '/admin/inventory',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 border-b border-[#B69A7A]/30 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B69A7A]">
            EXECUTIVE DASHBOARD
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#252525] sm:text-3xl">
            Storefront Performance & Operations
          </h1>
          <p className="mt-1 text-xs font-light text-[#252525]/70">
            Live statistics calculated from the product catalog and inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#B69A7A]/40 bg-[#FAF7F2] px-4 py-2 text-xs font-semibold text-[#252525] shadow-sm transition-all hover:bg-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#B69A7A]' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#252525] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F5F0E8] shadow-md transition-all hover:bg-[#252525]/90"
          >
            <span>+ Add Garment</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const content = (
            <>
              <div>
                <p className={`mb-1 text-xs font-bold uppercase tracking-wider ${metric.titleColor}`}>
                  {metric.title}
                </p>
                <h2 className={`font-serif text-2xl font-bold sm:text-3xl ${metric.valueColor}`}>
                  {metric.value}
                </h2>
                <p className={`mt-1.5 text-[11px] font-light ${metric.captionColor}`}>
                  {metric.caption}
                </p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${metric.iconBadge}`}>
                <Icon className="h-5 w-5" />
              </div>
            </>
          );
          const className = `flex items-start justify-between rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${metric.cardBg}`;

          return metric.href ? (
            <Link key={metric.title} href={metric.href} className={className}>
              {content}
            </Link>
          ) : (
            <div key={metric.title} className={className}>
              {content}
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A7A]">
              SALES OVER TIME
            </span>
            <h2 className="mt-1 font-serif text-xl font-bold text-[#252525]">
              {chartMetric === 'revenue' ? 'Revenue' : 'Orders'} trend
            </h2>
            <p className="mt-1 text-xs text-[#252525]/60">
              Cancelled orders are excluded from this chart.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#252525]/60">
              Period
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="rounded-lg border border-[#B69A7A]/40 bg-white px-3 py-2 text-xs font-medium normal-case tracking-normal text-[#252525] outline-none focus:border-[#B69A7A]"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="12m">Last 12 months</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#252525]/60">
              Show
              <select
                value={chartMetric}
                onChange={(event) => setChartMetric(event.target.value)}
                className="rounded-lg border border-[#B69A7A]/40 bg-white px-3 py-2 text-xs font-medium normal-case tracking-normal text-[#252525] outline-none focus:border-[#B69A7A]"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#252525]/60">
            Total {chartMetric === 'revenue' ? 'revenue' : 'orders'} in selected period
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-[#252525]">
            {chartMetric === 'revenue' ? formatCurrency(chartTotal) : chartTotal.toLocaleString()}
          </p>
        </div>

        <div className="overflow-x-auto pb-2">
          <div
            className={`flex h-56 min-w-[560px] items-end gap-1 border-b border-[#B69A7A]/30 sm:gap-2 ${
              period === '12m' ? 'sm:min-w-0' : ''
            }`}
            role="img"
            aria-label={`${chartMetric === 'revenue' ? 'Revenue' : 'Orders'} bar chart for the selected period`}
          >
            {chartLoading ? (
              <p className="mb-4 w-full text-center text-xs text-[#252525]/60">Loading chart data...</p>
            ) : trend.length ? (
              trend.map((bucket, index) => {
                const value = chartValue(bucket);
                const height = chartMax ? Math.max((value / chartMax) * 100, value > 0 ? 2 : 0) : 0;
                const showLabel = period !== '30d' || index % 5 === 0 || index === trend.length - 1;

                return (
                  <div
                    key={bucket.key}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                    title={`${bucket.label}: ${chartMetric === 'revenue' ? formatCurrency(value) : `${value} orders`}`}
                  >
                    <div className="flex h-[80%] w-full items-end">
                      <div
                        className="w-full rounded-t-md bg-[#B69A7A] transition-all hover:bg-[#252525]"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="h-6 whitespace-nowrap text-[9px] text-[#252525]/60 sm:text-[10px]">
                      {showLabel ? bucket.label : ''}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="mb-4 w-full text-center text-xs text-[#252525]/60">No sales data for this period.</p>
            )}
          </div>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-xs font-medium text-rose-700">
            {error}
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/customers"
          className="group flex items-center justify-between rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 transition-all hover:border-[#B69A7A]"
        >
          <div>
            <h3 className="font-serif text-sm font-bold text-[#252525] transition-colors group-hover:text-[#B69A7A]">
              Manage Customers →
            </h3>
            <p className="mt-0.5 text-[11px] text-[#252525]/60">Customer directory and account actions</p>
          </div>
          <Users className="h-5 w-5 text-[#B69A7A]" />
        </Link>
        <Link
          href="/admin/orders"
          className="group flex items-center justify-between rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 transition-all hover:border-[#B69A7A]"
        >
          <div>
            <h3 className="font-serif text-sm font-bold text-[#252525] transition-colors group-hover:text-[#B69A7A]">
              Manage Orders →
            </h3>
            <p className="mt-0.5 text-[11px] text-[#252525]/60">Review orders and fulfillment status</p>
          </div>
          <ShoppingBag className="h-5 w-5 text-[#B69A7A]" />
        </Link>
        <Link
          href="/admin/products"
          className="group flex items-center justify-between rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 transition-all hover:border-[#B69A7A]"
        >
          <div>
            <h3 className="font-serif text-sm font-bold text-[#252525] transition-colors group-hover:text-[#B69A7A]">
              Manage Products →
            </h3>
            <p className="mt-0.5 text-[11px] text-[#252525]/60">Edit prices, variants & stock</p>
          </div>
          <Shirt className="h-5 w-5 text-[#B69A7A]" />
        </Link>
        <Link
          href="/admin/categories"
          className="group flex items-center justify-between rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 transition-all hover:border-[#B69A7A]"
        >
          <div>
            <h3 className="font-serif text-sm font-bold text-[#252525] transition-colors group-hover:text-[#B69A7A]">
              Categories & Menu →
            </h3>
            <p className="mt-0.5 text-[11px] text-[#252525]/60">Control dropdown categories</p>
          </div>
          <CheckCircle2 className="h-5 w-5 text-[#B69A7A]" />
        </Link>
        <Link
          href="/admin/inventory"
          className="group flex items-center justify-between rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5 transition-all hover:border-[#B69A7A]"
        >
          <div>
            <h3 className="font-serif text-sm font-bold text-[#252525] transition-colors group-hover:text-[#B69A7A]">
              Inventory Restock →
            </h3>
            <p className="mt-0.5 text-[11px] text-[#252525]/60">Update SKU warehouse levels</p>
          </div>
          <AlertTriangle className="h-5 w-5 text-[#B69A7A]" />
        </Link>
      </div>
    </div>
  );
}
