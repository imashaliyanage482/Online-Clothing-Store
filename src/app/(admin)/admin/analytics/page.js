import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import { TrendingUp, RefreshCw, ShoppingCart, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Sales & Revenue Analytics"
        description="Conversion rates, average basket values, and collection profit margins."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Average Order Value" value={formatCurrency(198.50)} change="+6.2%" icon={ShoppingCart} />
        <StatCard title="Store Conversion Rate" value="3.42%" change="+0.4%" icon={Percent} />
        <StatCard title="Gross Margin" value="68.4%" change="+1.2%" icon={TrendingUp} />
        <StatCard title="Return Rate" value="2.8%" change="-0.5%" icon={RefreshCw} isPositive={true} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Revenue Breakdown by Category
        </h3>
        <div className="space-y-4 text-xs font-semibold">
          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Women's Collection (52%)</span>
              <span>{formatCurrency(25110.80)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div className="bg-slate-900 h-2.5 rounded-full" style={{ width: '52%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Men's Collection (34%)</span>
              <span>{formatCurrency(16418.60)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '34%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Accessories (14%)</span>
              <span>{formatCurrency(6760.60)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '14%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
