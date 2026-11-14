'use client';

import React, { useState } from 'react';
import { AlertTriangle, Search, ShieldCheck, Trash2 } from 'lucide-react';

export default function CustomerAccountRemoval() {
  const [query, setQuery] = useState('');
  const [customer, setCustomer] = useState(null);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const searchCustomer = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setCustomer(null);
    setConfirming(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/customers?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to find that customer.');
        return;
      }
      setCustomer(data.customer);
    } catch (searchError) {
      setError('Customer search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const anonymizeCustomer = async (event) => {
    event.preventDefault();
    if (!customer || confirmationEmail.trim().toLowerCase() !== customer.email.toLowerCase()) {
      setError('Enter the customer email exactly to confirm this action.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(customer.id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to anonymize this customer account.');
        return;
      }

      setMessage(
        `Customer account disabled and personal details anonymized. ${data.orderCount} order record(s) and their financial history were retained.`
      );
      setCustomer(null);
      setConfirmationEmail('');
      setQuery('');
      setConfirming(false);
    } catch (deleteError) {
      setError('Customer account update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#B69A7A]/40 bg-white text-[#B69A7A]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-[#252525]">Customer Account Removal</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#252525]/65">
            Search by exact customer email or ID. This restricted action disables customer sign-in and
            anonymizes personal details; it does not delete order or financial history.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          {message}
        </p>
      )}

      <form onSubmit={searchCustomer} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="customer-account-query">Customer email or ID</label>
        <input
          id="customer-account-query"
          type="text"
          required
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Exact customer email or ID"
          className="min-w-0 flex-1 rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs text-[#252525] focus:border-[#252525] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#252525] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F5F0E8] transition-colors hover:bg-[#252525]/90 disabled:opacity-50"
        >
          <Search className="h-3.5 w-3.5" />
          {loading ? 'Searching…' : 'Find Customer'}
        </button>
      </form>

      {customer && (
        <div className="mt-5 rounded-xl border border-[#B69A7A]/35 bg-white p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-[#252525]">Confirm the customer identity</h3>
          <dl className="mt-3 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-[#252525]/55">Name</dt>
              <dd className="mt-0.5 font-medium text-[#252525]">{customer.name}</dd>
            </div>
            <div>
              <dt className="text-[#252525]/55">Email</dt>
              <dd className="mt-0.5 break-all font-medium text-[#252525]">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-[#252525]/55">Customer ID</dt>
              <dd className="mt-0.5 break-all font-mono text-[#252525]">{customer.id}</dd>
            </div>
            <div>
              <dt className="text-[#252525]/55">Order records retained</dt>
              <dd className="mt-0.5 font-medium text-[#252525]">{customer.orderCount}</dd>
            </div>
          </dl>

          {customer.orderCount > 0 && (
            <p className="mt-4 flex gap-2 rounded-lg bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Order items, amounts, payment status, and order history will remain. Customer contact
              information in those order records will be anonymized.
            </p>
          )}

          {!confirming ? (
            <button
              type="button"
              onClick={() => {
                setError('');
                setConfirming(true);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Prepare Account Removal
            </button>
          ) : (
            <form onSubmit={anonymizeCustomer} className="mt-4 space-y-3 border-t border-[#B69A7A]/25 pt-4">
              <p className="text-xs font-medium text-[#252525]">
                To confirm, enter this customer&apos;s email: <strong>{customer.email}</strong>
              </p>
              <label className="sr-only" htmlFor="customer-delete-confirmation">Confirm customer email</label>
              <input
                id="customer-delete-confirmation"
                type="email"
                required
                autoComplete="off"
                value={confirmationEmail}
                onChange={(event) => setConfirmationEmail(event.target.value)}
                className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs text-[#252525] focus:border-[#252525] focus:outline-none"
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading || confirmationEmail.trim().toLowerCase() !== customer.email.toLowerCase()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {loading ? 'Updating…' : 'Confirm & Anonymize'}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setConfirming(false);
                    setConfirmationEmail('');
                    setError('');
                  }}
                  className="rounded-xl border border-[#B69A7A]/45 px-4 py-2.5 text-xs font-semibold text-[#252525] hover:bg-[#F5F0E8] disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
