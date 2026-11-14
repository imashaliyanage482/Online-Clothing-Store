'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { formatCurrency as formatAmount } from '@/lib/utils/currency';

const DEFAULT_SETTINGS = {
  storeName: 'FASHIONSTORE',
  storeTagline: 'WEAR YOUR STORY',
  currencyCode: 'LKR',
  enabledCurrencies: ['LKR', 'USD'],
  lkrPerUsd: 300,
  lowStockThreshold: 10,
  supportEmail: 'concierge@fashionstore.com',
  supportPhone: '+94 11 234 5678',
  freeShippingThreshold: 15000,
  standardShippingFee: 450,
  address: 'Atelier Flagship, Colombo 07, Sri Lanka',
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [currencyCode, setCurrencyCode] = useState('LKR');

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load store settings.');
        }

        if (!active) return;
        const loadedSettings = data.settings || {};
        const nextSettings = { ...DEFAULT_SETTINGS, ...loadedSettings };
        const enabledCurrencies = Array.isArray(nextSettings.enabledCurrencies)
          ? nextSettings.enabledCurrencies.filter((code) => ['LKR', 'USD'].includes(code))
          : DEFAULT_SETTINGS.enabledCurrencies;
        nextSettings.enabledCurrencies = enabledCurrencies.length
          ? enabledCurrencies
          : DEFAULT_SETTINGS.enabledCurrencies;
        setSettings(nextSettings);

        let savedCurrency = null;
        try {
          savedCurrency = localStorage.getItem('fashionstore_currency');
        } catch (error) {
          console.error('Failed to read customer currency preference:', error);
        }
        const initialCurrency = nextSettings.enabledCurrencies.includes(savedCurrency)
          ? savedCurrency
          : nextSettings.enabledCurrencies.includes(nextSettings.currencyCode)
            ? nextSettings.currencyCode
            : nextSettings.enabledCurrencies[0];
        setCurrencyCode(initialCurrency);
      } catch (error) {
        if (active) console.error('Failed fetching storefront settings:', error);
      }
    };

    const refreshSettingsWhenVisible = () => {
      if (document.visibilityState === 'visible') loadSettings();
    };

    loadSettings();
    window.addEventListener('focus', loadSettings);
    document.addEventListener('visibilitychange', refreshSettingsWhenVisible);

    return () => {
      active = false;
      window.removeEventListener('focus', loadSettings);
      document.removeEventListener('visibilitychange', refreshSettingsWhenVisible);
    };
  }, []);

  const changeCurrency = useCallback((code) => {
    if (!settings.enabledCurrencies.includes(code)) return;
    setCurrencyCode(code);
    try {
      localStorage.setItem('fashionstore_currency', code);
    } catch (error) {
      console.error('Failed to save customer currency preference:', error);
    }
  }, [settings.enabledCurrencies]);

  const formatPrice = useCallback(
    (amount) => formatAmount(amount, currencyCode, settings.lkrPerUsd),
    [currencyCode, settings.lkrPerUsd]
  );

  const value = useMemo(() => ({
    settings,
    currencyCode,
    enabledCurrencies: settings.enabledCurrencies,
    changeCurrency,
    formatPrice,
  }), [settings, currencyCode, changeCurrency, formatPrice]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider.');
  }
  return context;
}
