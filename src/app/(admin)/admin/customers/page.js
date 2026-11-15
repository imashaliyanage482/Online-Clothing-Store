'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshCw,
  Search,
  Users,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';
import CustomerAccountRemoval from '@/components/admin/CustomerAccountRemoval';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit Modal State
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete Confirmation State
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/customers?sync=true');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to load customers.');
      }
      setCustomers(data.customers || []);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone, customer.id]
        .some((value) => String(value || '').toLowerCase().includes(search))
    );
  }, [customers, query]);

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setEditForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    });
    setEditError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setEditSaving(true);
    setEditError('');

    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(editingCustomer.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update customer details.');
      }

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, ...editForm }
            : c
        )
      );

      setEditingCustomer(null);
      setSuccessMessage(`Customer "${editForm.name}" updated successfully.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setEditError(err.message || 'Error updating customer.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(customerToDelete.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete customer.');
      }

      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      setSuccessMessage(`Customer "${customerToDelete.name}" deleted successfully.`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setCustomerToDelete(null);
    } catch (err) {
      alert(err.message || 'Failed to delete customer.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col gap-4 border-b border-[#B69A7A]/30 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B69A7A]">
            CUSTOMER MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#252525] sm:text-3xl">Customers</h1>
          <p className="mt-1 text-xs text-[#252525]/70">
            Review customer accounts, update details, manage orders and access controls.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B69A7A]/40 bg-[#FAF7F2] px-4 py-2.5 text-xs font-semibold text-[#252525] shadow-sm transition-colors hover:bg-white disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#B69A7A]' : ''}`} />
          Refresh Customers
        </button>
      </header>

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#B69A7A]/25 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#252525]">
            <Users className="h-4 w-4 text-[#B69A7A]" />
            Customer Directory
            <span className="rounded-full bg-[#B69A7A]/15 px-2 py-0.5 text-[10px] text-[#252525]/70">
              {customers.length}
            </span>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Filter customers</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#252525]/45" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by name, email, phone or ID"
              className="w-full rounded-xl border border-[#B69A7A]/35 bg-white py-2.5 pl-9 pr-3 text-xs text-[#252525] outline-none focus:border-[#252525]"
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-xs text-[#252525]">
            <thead className="border-b border-[#B69A7A]/25 bg-[#F5F0E8] text-[10px] font-bold uppercase tracking-wider text-[#252525]/65">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Orders</th>
                <th className="px-5 py-3.5">Total Spend</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5">Account</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B69A7A]/20">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#252525]/60">
                    <RefreshCw className="mx-auto mb-2 h-5 w-5 animate-spin text-[#B69A7A]" />
                    Loading customers…
                  </td>
                </tr>
              ) : filteredCustomers.length ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="transition-colors hover:bg-white/60">
                    <td className="px-5 py-4">
                      <div className="font-semibold">{customer.name}</div>
                      <div className="mt-1 font-mono text-[10px] text-[#252525]/50">{customer.id}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="break-all">{customer.email}</div>
                      {customer.phone && <div className="mt-1 text-[10px] text-[#252525]/55">{customer.phone}</div>}
                    </td>
                    <td className="px-5 py-4">{customer.totalOrders ?? 0}</td>
                    <td className="px-5 py-4 font-semibold">{formatCurrency(customer.totalSpent ?? 0)}</td>
                    <td className="px-5 py-4">{formatDate(customer.createdAt)}</td>
                    <td className="px-5 py-4">
                      {customer.anonymizedAt ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                          Anonymized
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(customer)}
                          title="Edit Customer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#B69A7A]/30 bg-white text-[#252525] transition-colors hover:border-[#B69A7A] hover:bg-[#FAF7F2]"
                        >
                          <Pencil className="h-3.5 w-3.5 text-[#B69A7A]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(customer)}
                          title="Delete Customer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#252525]/60">
                    {query ? 'No customers match your filter.' : 'No customers found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[#B69A7A]/25 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#252525]">Edit Customer Details</h3>
                <p className="mt-0.5 text-xs text-[#252525]/65">ID: {editingCustomer.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="rounded-lg p-1 text-[#252525]/60 hover:bg-[#F5F0E8] hover:text-[#252525]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252525]">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3.5 py-2.5 text-xs text-[#252525] outline-none focus:border-[#252525]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525]">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3.5 py-2.5 text-xs text-[#252525] outline-none focus:border-[#252525]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525]">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+94 77 123 4567"
                  className="mt-1 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-3.5 py-2.5 text-xs text-[#252525] outline-none focus:border-[#252525]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#B69A7A]/25">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="rounded-xl border border-[#B69A7A]/30 bg-white px-4 py-2.5 text-xs font-semibold text-[#252525] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#252525] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#3d3d3d] disabled:opacity-50"
                >
                  {editSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#252525]">Delete Customer Account?</h3>
                <p className="text-xs text-[#252525]/60">This action cannot be undone.</p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#252525]/80">
              Are you sure you want to delete customer{' '}
              <strong className="text-[#252525]">{customerToDelete.name}</strong> ({customerToDelete.email})?
              Their customer record and login profile will be removed.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-[#252525] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCustomer}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomerAccountRemoval />
    </div>
  );
}
