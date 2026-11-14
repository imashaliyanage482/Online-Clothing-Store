'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

async function readApiJson(response, endpoint) {
  const body = await response.text();
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(
      `${endpoint} returned a non-JSON response (HTTP ${response.status}). Restart the development server and try again.`
    );
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filterError, setFilterError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState('');

  const fetchProducts = useCallback(async (signal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (department !== 'ALL') params.set('gender', department);
      if (newArrivalsOnly) params.set('new', 'true');
      if (collectionFilter) params.set('collection', collectionFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      if (search.trim()) params.set('q', search.trim());

      const query = params.toString();
      const res = await fetch(query ? `/api/products?${query}` : '/api/products', {
        signal,
        cache: 'no-store',
      });
      const data = await readApiJson(res, '/api/products');
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load products.');
      }
      setProducts(data.products || []);
      setFilterError('');
    } catch (err) {
      if (signal?.aborted) return;
      setFilterError(err.message || 'Failed to load products.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [categoryFilter, collectionFilter, department, newArrivalsOnly, search]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((response) => readApiJson(response, '/api/categories')),
      fetch('/api/collections?active=true').then((response) =>
        readApiJson(response, '/api/collections')
      ),
    ])
      .then(([categoryData, collectionData]) => {
        if (!categoryData.success || !collectionData.success) {
          throw new Error(categoryData.error || collectionData.error || 'Failed to load product filters.');
        }
        setCategories(categoryData.categories || []);
        setCollections(collectionData.collections || []);
      })
      .catch((err) => setFilterError(err.message || 'Failed to load product filters.'));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await readApiJson(res, `/api/products/${deleteTarget.id}`);
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setNotification(`Deleted "${deleteTarget.title}" successfully.`);
        setTimeout(() => setNotification(''), 4000);
      } else {
        alert(data.error || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Delete request failed.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('ALL');
    setNewArrivalsOnly(false);
    setCollectionFilter('');
    setCategoryFilter('');
  };
  const departmentCategories = categories.filter((category) => category.gender === department);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#B69A7A]/30">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-1">
            CATALOG INVENTORY CONTROL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
            Apparel Products
          </h1>
          <p className="text-xs text-[#252525]/70 mt-1 font-light">
            Manage public store garments, prices in LKR, stock levels, and collection associations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProducts()}
            disabled={loading}
            className="p-2.5 bg-[#FAF7F2] border border-[#B69A7A]/40 rounded-xl text-[#252525] hover:bg-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#B69A7A]' : ''}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#252525] text-[#F5F0E8] rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-[#252525]/90 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Garment</span>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}
      {filterError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{filterError}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#B69A7A]/30 space-y-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#B69A7A] absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, category, or description…"
            className="w-full pl-10 pr-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 mr-1 text-xs font-semibold text-[#252525]/70 uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            Department:
          </span>
          {[
            { value: 'ALL', label: 'All Products' },
            { value: 'women', label: 'Women' },
            { value: 'men', label: 'Men' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                if (department === value) return;
                setDepartment(value);
                setCategoryFilter('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                department === value
                  ? 'bg-[#252525] text-[#F5F0E8]'
                  : 'bg-white text-[#252525] border border-[#B69A7A]/40 hover:bg-[#B69A7A]/15'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={newArrivalsOnly}
            onClick={() => setNewArrivalsOnly((value) => !value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              newArrivalsOnly
                ? 'bg-[#252525] text-[#F5F0E8]'
                : 'bg-white text-[#252525] border border-[#B69A7A]/40 hover:bg-[#B69A7A]/15'
            }`}
          >
            New Arrivals
          </button>
          <label className="sr-only" htmlFor="collection-filter">Collection</label>
          <select
            id="collection-filter"
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#B69A7A]/40 bg-white text-xs text-[#252525]"
          >
            <option value="">All Collections</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.slug}>{collection.title}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="category-filter">Product Category</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            disabled={department === 'ALL'}
            className="px-3 py-2 rounded-lg border border-[#B69A7A]/40 bg-white text-xs text-[#252525] disabled:opacity-50"
          >
            <option value="">{department === 'ALL' ? 'Select department first' : 'All Categories'}</option>
            {departmentCategories.map((category) => (
              <option key={category.id} value={category.slug}>{category.title}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-1.5 rounded-lg border border-[#B69A7A]/40 bg-white text-xs font-semibold text-[#252525] hover:bg-[#B69A7A]/15"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#252525]">
            <thead className="bg-[#F5F0E8] text-[10.5px] font-bold uppercase tracking-wider text-[#252525]/70 border-b border-[#B69A7A]/25">
              <tr>
                <th className="px-5 py-3.5">Garment</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Price (LKR)</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B69A7A]/20">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B69A7A] mb-2" />
                    Loading catalog products…
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-14 bg-[#EBE3D5] rounded-lg overflow-hidden shrink-0 border border-[#B69A7A]/30">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              sizes="44px"
                              className="object-cover object-center"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-[#252525]/40 font-mono">
                              No Pic
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-[#252525] truncate max-w-[220px]">
                            {p.title}
                          </p>
                          <p className="text-[10px] text-[#252525]/60 font-mono truncate max-w-[200px]">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#252525]/85">
                      {p.category}
                      {p.needsCategoryReview && (
                        <span
                          title={p.categoryReviewReason || 'Review this category assignment.'}
                          className="mt-1 block text-[10px] font-semibold text-amber-700"
                        >
                          Needs category review
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#B69A7A]/20 text-[#252525] border border-[#B69A7A]/40">
                        {p.gender === 'collection' ? 'Collection' : p.gender || 'women'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#252525]">
                        {formatCurrency(p.price)}
                      </div>
                      {p.originalPrice && (
                        <div className="text-[10px] text-[#252525]/50 line-through">
                          {formatCurrency(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stockQuantity <= 5
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : p.stockQuantity <= 10
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {p.stockQuantity ?? 0} in stock
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#252525]/60 hover:text-[#252525] hover:bg-[#B69A7A]/20 rounded-lg transition-colors"
                          title="View on Live Store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-1.5 text-[#252525]/80 hover:text-[#B69A7A] hover:bg-[#B69A7A]/20 rounded-lg transition-colors"
                          title="Edit Garment"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                    No products matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-md w-full p-6 border border-[#B69A7A]/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-[#252525]">
                Delete Garment?
              </h3>
            </div>
            <p className="text-xs text-[#252525]/80 leading-relaxed font-light">
              Are you sure you want to permanently delete <strong>{deleteTarget.title}</strong>? This action cannot be undone and will immediately remove the product from public collections.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#252525] hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
