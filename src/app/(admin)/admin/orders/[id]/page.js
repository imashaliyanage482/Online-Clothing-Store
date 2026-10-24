'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function AdminOrderDetailPage({ params }) {
  const [status, setStatus] = useState('SHIPPED');
  const [updated, setUpdated] = useState(false);

  const handleUpdate = () => {
    setUpdated(true);
    setTimeout(() => setUpdated(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/orders" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Orders List</span>
      </Link>

      <AdminHeader
        title={`Order Fulfillment: ${params.id}`}
        description="Update carrier shipment information, tracking numbers, and fulfillment status."
      />

      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 shadow-sm">
        {updated && (
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-semibold">
            Fulfillment status successfully updated.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Update Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white"
            >
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Carrier Tracking Number
            </label>
            <input
              defaultValue="748920194819"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white font-mono"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleUpdate}>Save Order Status</Button>
        </div>
      </div>
    </div>
  );
}
