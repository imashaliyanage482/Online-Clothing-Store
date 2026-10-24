'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/customer/CustomerHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Jane Doe');
  const [email] = useState(user?.email || 'customer@example.com');
  const [phone, setPhone] = useState(user?.phone || '+1 555-0144');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <CustomerHeader
        title="Personal Profile"
        subtitle="Manage your contact details and default customer preferences."
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {saved && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            Profile details updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            value={email}
            disabled
            className="bg-slate-50 cursor-not-allowed"
          />

          <Input
            label="Contact Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
