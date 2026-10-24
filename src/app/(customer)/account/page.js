'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/customer/CustomerHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Package, MapPin, Heart, ArrowRight } from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <CustomerHeader
        title={`Welcome, ${user?.name || 'Customer'}`}
        subtitle="Manage your apparel orders, delivery addresses, and account credentials."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">2</div>
            <div className="text-xs text-slate-500 font-medium">Active Orders</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">5</div>
            <div className="text-xs text-slate-500 font-medium">Wishlist Items</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">1</div>
            <div className="text-xs text-slate-500 font-medium">Saved Address</div>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="text-base font-bold text-slate-900">Recent Order Activity</h2>
          <Link href="/account/orders" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-slate-100 rounded-lg bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900">FS-2026-98124</span>
                <Badge variant="warning">In Transit</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Merino Wool Trench Coat (Camel / M) × 1
              </p>
            </div>
            <Link href="/account/orders/FS-2026-98124/track">
              <Button size="sm" variant="outline">
                Track Shipment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
