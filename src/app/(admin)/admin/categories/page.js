import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

const categories = [
  { id: 'cat-1', name: "Women's Collection", slug: 'womens-collection', productCount: 34 },
  { id: 'cat-2', name: "Men's Collection", slug: 'mens-collection', productCount: 28 },
  { id: 'cat-3', name: 'Accessories', slug: 'accessories', productCount: 19 },
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminHeader
          title="Apparel Categories"
          description="Manage primary navigation collections, descriptions, and banner artwork."
        />
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Category Name</th>
              <th className="px-6 py-3">URL Slug</th>
              <th className="px-6 py-3">Active Garments</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{c.slug}</td>
                <td className="px-6 py-4 text-xs">{c.productCount} products</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-bold text-amber-600 hover:text-amber-700">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
