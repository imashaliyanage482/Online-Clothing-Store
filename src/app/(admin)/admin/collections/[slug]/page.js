'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Edit, ExternalLink, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function AdminCollectionProductsPage({ params }) {
  const { slug } = params;
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingProductId, setUpdatingProductId] = useState('');
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const loadCollection = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [collectionsResponse, productsResponse] = await Promise.all([
        fetch('/api/collections'),
        fetch(`/api/products?collection=${encodeURIComponent(slug)}`),
      ]);
      const [collectionsData, productsData] = await Promise.all([
        collectionsResponse.json(),
        productsResponse.json(),
      ]);
      if (!collectionsResponse.ok || !collectionsData.success) {
        throw new Error(collectionsData.error || 'Failed to load collections.');
      }
      if (!productsResponse.ok || !productsData.success) {
        throw new Error(productsData.error || 'Failed to load collection products.');
      }

      const selectedCollection = (collectionsData.collections || []).find((item) => item.slug === slug);
      if (!selectedCollection) {
        throw new Error('Collection not found.');
      }
      setCollection(selectedCollection);
      setProducts(productsData.products || []);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load collection.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  const openProductPicker = async () => {
    setProductPickerOpen(true);
    setCatalogLoading(true);
    setError('');
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load catalog products.');
      }
      setCatalogProducts(data.products || []);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load catalog products.');
    } finally {
      setCatalogLoading(false);
    }
  };

  const addExistingProduct = async (product) => {
    setUpdatingProductId(product.id);
    setError('');
    try {
      const currentSlugs = product.collectionSlugs || [product.collectionSlug].filter(Boolean);
      const collectionSlugs = [...new Set([...currentSlugs, slug])];
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionSlugs,
          collectionSlug: collectionSlugs[0] || null,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to add product to collection.');
      }
      setProducts((currentProducts) => [
        data.product,
        ...currentProducts.filter((item) => item.id !== data.product.id),
      ]);
      setProductPickerOpen(false);
      setProductSearch('');
    } catch (addError) {
      setError(addError.message || 'Failed to add product to collection.');
    } finally {
      setUpdatingProductId('');
    }
  };

  const eligibleProducts = catalogProducts.filter((product) => {
    const assignedSlugs = product.collectionSlugs || [product.collectionSlug].filter(Boolean);
    const searchValue = `${product.title || ''} ${product.category || ''} ${product.gender || ''}`.toLowerCase();
    return !assignedSlugs.includes(slug) && searchValue.includes(productSearch.trim().toLowerCase());
  });

  const removeProduct = async (product) => {
    setUpdatingProductId(product.id);
    setError('');
    try {
      const collectionSlugs = (product.collectionSlugs || [product.collectionSlug].filter(Boolean))
        .filter((collectionSlug) => collectionSlug !== slug);
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionSlugs,
          collectionSlug: collectionSlugs[0] || null,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove product from collection.');
      }
      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id));
    } catch (removeError) {
      setError(removeError.message || 'Failed to remove product from collection.');
    } finally {
      setUpdatingProductId('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#B69A7A]/30 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/collections"
            className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-[#252525]/70 hover:text-[#252525]"
          >
            <ArrowLeft className="h-4 w-4" />
            All Collections
          </Link>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B69A7A]">
            COLLECTION PRODUCTS
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#252525] sm:text-3xl">
            {collection?.title || 'Collection'}
          </h1>
          {collection?.description && (
            <p className="mt-1 max-w-2xl text-xs font-light text-[#252525]/70">
              {collection.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadCollection}
            disabled={loading}
            aria-label="Refresh collection products"
            className="rounded-xl border border-[#B69A7A]/40 bg-[#FAF7F2] p-2.5 text-[#252525] shadow-sm hover:bg-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#B69A7A]' : ''}`} />
          </button>
          <button
            type="button"
            onClick={openProductPicker}
            className="inline-flex items-center gap-2 rounded-xl border border-[#B69A7A]/50 bg-[#FAF7F2] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#252525] hover:bg-white"
          >
            <Search className="h-4 w-4" />
            Add Existing Product
          </button>
          <Link
            href={`/admin/collections/${encodeURIComponent(slug)}/products/new`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#252525] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F5F0E8] shadow-sm hover:bg-[#252525]/90"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {productPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="existing-products-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[#B69A7A]/40 bg-[#FAF7F2] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#B69A7A]/25 p-5">
              <div>
                <h2 id="existing-products-title" className="font-serif text-xl font-bold text-[#252525]">
                  Add Existing Product
                </h2>
                <p className="mt-1 text-xs text-[#252525]/65">
                  Select a Women’s or Men’s catalog product. It stays in its department and is also added to this collection.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductPickerOpen(false)}
                aria-label="Close product selector"
                className="rounded-lg p-2 text-[#252525]/60 hover:bg-[#B69A7A]/15 hover:text-[#252525]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {error && (
              <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="border-b border-[#B69A7A]/20 p-5">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#252525]/45" />
                <input
                  type="search"
                  value={productSearch}
                  onChange={(event) => setProductSearch(event.target.value)}
                  placeholder="Search products by name, department, or category"
                  aria-label="Search existing catalog products"
                  className="w-full rounded-xl border border-[#B69A7A]/40 bg-white py-2.5 pl-10 pr-4 text-xs text-[#252525] focus:border-[#252525] focus:outline-none"
                />
              </label>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-5">
              {catalogLoading ? (
                <p className="py-8 text-center text-xs text-[#252525]/60">Loading catalog products…</p>
              ) : eligibleProducts.length ? (
                <div className="space-y-2">
                  {eligibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 rounded-xl border border-[#B69A7A]/25 bg-white p-3"
                    >
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#EBE3D5]">
                        {product.image && (
                          <Image src={product.image} alt="" fill sizes="44px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[#252525]">{product.title}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-[#B69A7A]">
                          {product.gender === 'collection'
                            ? `Collection · ${product.category}`
                            : `${product.gender === 'men' ? 'Men' : 'Women'} · ${product.category}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addExistingProduct(product)}
                        disabled={Boolean(updatingProductId)}
                        className="shrink-0 rounded-lg bg-[#252525] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#F5F0E8] hover:bg-[#252525]/90 disabled:opacity-50"
                      >
                        {updatingProductId === product.id ? 'Adding…' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-[#252525]/60">
                  No unassigned catalog products match this search.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      <div className="rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-5">
        <p className="text-xs text-[#252525]/70">
          Collection-only products stay outside the Women/Men departments. Existing catalog products keep their department and category while being associated with this collection.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-xs text-[#252525]">
            <thead className="border-b border-[#B69A7A]/25 bg-[#F5F0E8] text-[10px] font-bold uppercase tracking-wider text-[#252525]/70">
              <tr>
                <th className="px-5 py-3.5">Garment</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Price (LKR)</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Status / Sections</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B69A7A]/20">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                    <RefreshCw className="mx-auto mb-2 h-5 w-5 animate-spin text-[#B69A7A]" />
                    Loading collection products…
                  </td>
                </tr>
              ) : products.length ? (
                products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-white/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-[#B69A7A]/30 bg-[#EBE3D5]">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              sizes="44px"
                              className="object-cover object-center"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[230px] truncate font-semibold text-[#252525]">{product.title}</p>
                          <p className="mt-1 max-w-[210px] truncate font-mono text-[10px] text-[#252525]/60">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#252525]/85">{product.category}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-full border border-[#B69A7A]/40 bg-[#B69A7A]/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#252525]">
                        {product.gender === 'collection'
                          ? 'Collection'
                          : product.gender || 'women'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#252525]">{formatCurrency(product.price)}</div>
                      {product.originalPrice && (
                        <div className="text-[10px] text-[#252525]/50 line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                        product.stockQuantity <= 5
                          ? 'border-rose-300 bg-rose-100 text-rose-800'
                          : product.stockQuantity <= 10
                            ? 'border-amber-300 bg-amber-100 text-amber-800'
                            : 'border-emerald-300 bg-emerald-100 text-emerald-800'
                      }`}>
                        {product.stockQuantity ?? 0} in stock
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          product.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {product.status || 'ACTIVE'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.isNew && (
                            <span className="rounded-full bg-[#B69A7A]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#252525]">
                              New
                            </span>
                          )}
                          {product.isSale && (
                            <span className="rounded-full bg-[#252525] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#F5F0E8]">
                              Sale
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="rounded-lg p-1.5 text-[#252525]/60 transition-colors hover:bg-[#B69A7A]/20 hover:text-[#252525]"
                          title="View on Store"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="rounded-lg p-1.5 text-[#252525]/80 transition-colors hover:bg-[#B69A7A]/20 hover:text-[#B69A7A]"
                          title="Edit Product"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeProduct(product)}
                          disabled={updatingProductId === product.id}
                          className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 disabled:opacity-50"
                          title="Remove from collection"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <h2 className="font-serif text-lg font-bold text-[#252525]">No products in this collection yet</h2>
                    <p className="mt-2 text-xs text-[#252525]/65">
                      Add a product here or associate an existing catalog product.
                    </p>
                    <Link
                      href={`/admin/collections/${encodeURIComponent(slug)}/products/new`}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#252525] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F5F0E8] hover:bg-[#252525]/90"
                    >
                      <Plus className="h-4 w-4" />
                      Add Product to Collection
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
