import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/currency';

const payments = [
  { id: 'tx_98124_stripe', orderId: 'FS-2026-98124', provider: 'STRIPE', amount: 322.80, status: 'PAID', date: 'Oct 24, 2026' },
  { id: 'tx_98123_paypal', orderId: 'FS-2026-98123', provider: 'PAYPAL', amount: 420.50, status: 'PAID', date: 'Oct 24, 2026' },
  { id: 'tx_98120_cod', orderId: 'FS-2026-98120', provider: 'CASH_ON_DELIVERY', amount: 155.00, status: 'UNPAID', date: 'Oct 22, 2026' },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Payment Records & Gateway Logs"
        description="Audit all incoming transactions, gateway response codes, and dispute settlements."
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Transaction ID</th>
              <th className="px-6 py-3">Order Ref</th>
              <th className="px-6 py-3">Gateway</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900">{p.id}</td>
                <td className="px-6 py-4 font-mono text-xs">{p.orderId}</td>
                <td className="px-6 py-4 text-xs font-semibold">{p.provider}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(p.amount)}</td>
                <td className="px-6 py-4">
                  <Badge variant={p.status === 'PAID' ? 'success' : 'warning'}>
                    {p.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
