import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Plus } from 'lucide-react';

const coupons = [
  { code: 'AUTUMN20', type: 'PERCENTAGE', value: '20%', minSpend: '$100', uses: '48 / 200', status: 'ACTIVE' },
  { code: 'WELCOME10', type: 'PERCENTAGE', value: '10%', minSpend: '$50', uses: '142', status: 'ACTIVE' },
  { code: 'FLASH50', type: 'FIXED_AMOUNT', value: '$50', minSpend: '$250', uses: '50 / 50', status: 'EXPIRED' },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminHeader
          title="Coupons & Promotional Codes"
          description="Create discount vouchers, configure spend minimums, and monitor redemption limits."
        />
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Discount</th>
              <th className="px-6 py-3">Min Spend</th>
              <th className="px-6 py-3">Redemptions</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c.code}>
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{c.code}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{c.value}</td>
                <td className="px-6 py-4 text-xs">{c.minSpend}</td>
                <td className="px-6 py-4 font-mono text-xs">{c.uses}</td>
                <td className="px-6 py-4">
                  <Badge variant={c.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {c.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
