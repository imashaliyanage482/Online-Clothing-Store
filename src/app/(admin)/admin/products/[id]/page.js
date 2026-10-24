'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function EditProductPage({ params }) {
  const [title, setTitle] = useState('Merino Wool Minimalist Trench Coat');
  const [basePrice, setBasePrice] = useState('285.00');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/products" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Products</span>
      </Link>

      <AdminHeader
        title={`Edit Product: ${params.id}`}
        description="Modify attributes, pricing, and variant stock thresholds."
      />

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-semibold">
            Product details updated.
          </div>
        )}

        <Input
          label="Garment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          label="Base Price ($ USD)"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          required
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
