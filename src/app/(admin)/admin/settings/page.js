'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Store, DollarSign } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'FASHIONSTORE',
    storeTagline: 'WEAR YOUR STORY',
    currencyCode: 'LKR',
    currencySymbol: 'Rs.',
    enabledCurrencies: ['LKR', 'USD'],
    lkrPerUsd: 300,
    lowStockThreshold: 10,
    supportEmail: 'concierge@fashionstore.com',
    supportPhone: '+94 11 234 5678',
    freeShippingThreshold: 15000,
    standardShippingFee: 450,
    address: 'Atelier Flagship, Colombo 07, Sri Lanka',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((current) => ({
            ...current,
            ...data.settings,
            enabledCurrencies: Array.isArray(data.settings.enabledCurrencies)
              ? data.settings.enabledCurrencies
              : current.enabledCurrencies,
          }));
        }
      })
      .catch((error) => console.error('Failed loading admin settings:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setNotification('Store settings successfully updated and saved.');
        setTimeout(() => setNotification(''), 4000);
      } else {
        alert(data.error || 'Failed saving settings');
      }
    } catch (err) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#B69A7A]/30">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-1">
          GLOBAL CONFIGURATION
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
          Store Settings
        </h1>
        <p className="text-xs text-[#252525]/70 mt-1 font-light">
          Configure storefront branding, customer currency options, shipping, inventory alerts, and contact information.
        </p>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#B69A7A]/30 shadow-sm space-y-6">
        {/* Brand & Identity */}
        <div>
          <h2 className="font-serif text-base font-bold text-[#252525] mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#B69A7A]" />
            <span>Brand Identity & Display</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525] mb-1">
                Storefront Name
              </label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525] mb-1">
                Tagline / Sub-Brand
              </label>
              <input
                type="text"
                value={settings.storeTagline}
                onChange={(e) => setSettings({ ...settings, storeTagline: e.target.value })}
                className="w-full px-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Shipping */}
        <div className="pt-4 border-t border-[#B69A7A]/25">
          <h2 className="font-serif text-base font-bold text-[#252525] mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#B69A7A]" />
            <span>Currency & Exchange Rate</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525] mb-1">
                Default Display Currency
              </label>
              <select
                value={settings.currencyCode}
                onChange={(e) => setSettings({ ...settings, currencyCode: e.target.value, currencySymbol: e.target.value === 'USD' ? '$' : 'Rs.' })}
                className="w-full px-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
              >
                {settings.enabledCurrencies.map((code) => (
                  <option key={code} value={code}>{code === 'LKR' ? 'LKR (Rs.)' : 'USD ($)'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525] mb-1">
                USD Exchange Rate
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={settings.lkrPerUsd}
                onChange={(e) => setSettings({ ...settings, lkrPerUsd: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
              />
              <p className="text-[11px] text-[#252525]/60 mt-1">LKR for 1 USD</p>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase text-[#252525] mb-2">Customer Currency Options</span>
              <div className="flex items-center gap-4 min-h-10">
                {['LKR', 'USD'].map((code) => (
                  <label key={code} className="inline-flex items-center gap-2 text-xs text-[#252525]">
                    <input
                      type="checkbox"
                      checked={settings.enabledCurrencies.includes(code)}
                      onChange={(e) => {
                        if (!e.target.checked && settings.enabledCurrencies.length === 1) return;
                        const enabledCurrencies = e.target.checked
                          ? [...new Set([...settings.enabledCurrencies, code])]
                          : settings.enabledCurrencies.filter((item) => item !== code);
                        setSettings({ ...settings, enabledCurrencies, currencyCode: enabledCurrencies.includes(settings.currencyCode) ? settings.currencyCode : (enabledCurrencies[0] || '') });
                      }}
                    />
                    {code === 'LKR' ? 'Rs. LKR' : '$ USD'}
                  </label>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Inventory */}
        <div className="pt-4 border-t border-[#B69A7A]/25">
          <h2 className="font-serif text-base font-bold text-[#252525] mb-4">Inventory & Alerts</h2>
          <div className="max-w-sm">
            <label className="block text-xs font-semibold uppercase text-[#252525] mb-1">
              Low Stock SKU Threshold
            </label>
            <input
              type="number"
              min="1"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
            />
          </div>
        </div>

        {/* Contact & Support */}
        <div className="pt-4 border-t border-[#B69A7A]/25">
          <h2 className="font-serif text-base font-bold text-[#252525] mb-4">
            Concierge & Support Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525] mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#252525] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold uppercase text-[#252525] mb-1">
              Atelier Flagship Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#B69A7A]/25 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#252525] text-[#F5F0E8] text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-[#252525]/90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings…' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

    </div>
  );
}
