import React from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Plus, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

const products = [
  {
    id: 'p1',
    title: 'Merino Wool Minimalist Trench Coat',
    category: "Women's Collection",
    price: 285.00,
    stock: 42,
    status: 'ACTIVE',
  },
  {
    id: 'p2',
    title: 'Relaxed Fit Heavyweight Cotton Overshirt',
    category: "Men's Collection",
    price: 120.00,
    stock: 18,
    status: 'ACTIVE',
  },
  {
    id: 'p3',
    title: 'Structured Ribbed Knit Turtleneck',
    category: "Women's Collection",
    price: 95.00,
    stock: 5,
    status: 'LOW_STOCK',
  },
  {
    id: 'p4',
    title: 'Italian Pebble Leather Weekend Tote',
    category: 'Accessories',
    price: 340.00,
    stock: 24,
    status: 'ACTIVE',
  },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminHeader
          title="Apparel Products Management"
          description="Create, edit, and organize clothing pieces, sizes, and color SKUs."
        />
        <Link href="/admin/products/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Garment</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Product Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Base Price</th>
                <th className="px-6 py-3">Inventory</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.title}</td>
                  <td className="px-6 py-4 text-xs">{item.category}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.stock} units</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.status === 'LOW_STOCK' ? 'warning' : 'success'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${item.id}`}
                      className="p-1.5 text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
