'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: 'womens-collection',
    basePrice: '',
    description: '',
    sku: '',
    size: 'M',
    colorName: 'Black',
    colorHex: '#000000',
    stockQuantity: '20',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/admin/products');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminHeader
        title="Create New Garment"
        description="Add a new apparel piece with sizing, color swatches, and initial stock."
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <Input
              label="Garment Title"
              required
              placeholder="e.g., Italian Linen Relaxed Camp Collar Shirt"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white"
            >
              <option value="womens-collection">Women's Collection</option>
              <option value="mens-collection">Men's Collection</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <Input
              label="Base Price ($ USD)"
              type="number"
              step="0.01"
              required
              placeholder="120.00"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Garment Description
            </label>
            <textarea
              rows={4}
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Specify yarn type, fit silhouette, and wash care instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Initial Variant Matrix */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
            Initial Variant (Size & Color)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="SKU Code"
              required
              placeholder="FS-LIN-M-BLK"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
            <Input
              label="Size"
              required
              placeholder="M"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            />
            <Input
              label="Color Name"
              required
              placeholder="Onyx Black"
              value={formData.colorName}
              onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
            />
            <Input
              label="Initial Stock Qty"
              type="number"
              required
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Publish Product</Button>
        </div>
      </form>
    </div>
  );
}
