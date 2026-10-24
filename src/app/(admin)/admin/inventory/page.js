import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Badge from '@/components/ui/Badge';

const skuStock = [
  { sku: 'FS-TRN-M-CAM', product: 'Merino Wool Trench Coat', size: 'M', color: 'Camel', stock: 14, status: 'IN_STOCK' },
  { sku: 'FS-TRN-S-CAM', product: 'Merino Wool Trench Coat', size: 'S', color: 'Camel', stock: 8, status: 'IN_STOCK' },
  { sku: 'FS-OVR-L-OLV', product: 'Relaxed Fit Heavyweight Overshirt', size: 'L', color: 'Olive Green', stock: 18, status: 'IN_STOCK' },
  { sku: 'FS-TRT-S-IVY', product: 'Structured Ribbed Turtleneck', size: 'S', color: 'Ivory', stock: 2, status: 'LOW_STOCK' },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Inventory & SKU Management"
        description="Monitor size/color variant levels and configure low-stock reorder thresholds."
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Garment</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Color</th>
              <th className="px-6 py-3">Stock Units</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {skuStock.map((item) => (
              <tr key={item.sku}>
                <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900">{item.sku}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{item.product}</td>
                <td className="px-6 py-4 text-xs">{item.size}</td>
                <td className="px-6 py-4 text-xs">{item.color}</td>
                <td className="px-6 py-4 font-mono font-semibold text-slate-900">{item.stock}</td>
                <td className="px-6 py-4">
                  <Badge variant={item.status === 'LOW_STOCK' ? 'danger' : 'success'}>
                    {item.status}
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
