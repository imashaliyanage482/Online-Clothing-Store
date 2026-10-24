'use client';

import React, { useState } from 'react';
import CustomerHeader from '@/components/customer/CustomerHeader';
import Button from '@/components/ui/Button';

export default function AccountSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <CustomerHeader
        title="Account Preferences"
        subtitle="Configure communication and notifications."
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 max-w-lg">
        {saved && (
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-800">
            Preferences saved.
          </div>
        )}

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900">Order & Dispatch Notifications</span>
              <p className="text-xs text-slate-500">Receive tracking updates and delivery alerts via email.</p>
            </div>
          </label>
        </div>

        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
