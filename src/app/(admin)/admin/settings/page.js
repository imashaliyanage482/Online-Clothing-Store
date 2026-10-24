'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function StoreSettingsPage() {
  const [storeName, setStoreName] = useState('FashionStore');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('150.00');
  const [taxRate, setTaxRate] = useState('8.0');
  const [supportEmail, setSupportEmail] = useState('concierge@fashionstore.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <AdminHeader
        title="Store Configuration & Policies"
        description="Global settings for currency formatting, sales tax, and shipping rates."
      />

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 shadow-sm">
        {saved && (
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-semibold">
            Store settings saved successfully.
          </div>
        )}

        <Input
          label="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />

        <Input
          label="Free Delivery Spend Minimum ($ USD)"
          type="number"
          step="0.01"
          value={freeShippingThreshold}
          onChange={(e) => setFreeShippingThreshold(e.target.value)}
          required
        />

        <Input
          label="Default Estimated Tax Rate (%)"
          type="number"
          step="0.1"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
          required
        />

        <Input
          label="Customer Support Email"
          type="email"
          value={supportEmail}
          onChange={(e) => setSupportEmail(e.target.value)}
          required
        />

        <Button type="submit">Save Store Configuration</Button>
      </form>
    </div>
  );
}
