'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import ProductColorFields from '@/components/admin/ProductColorFields';
import { collectionProductCategories } from '@/lib/db/collectionProductCategories';

const initialForm = {
  title: '',
  slug: '',
  category: '',
  categorySlug: '',
  price: '',
  originalPrice: '',
  isSale: false,
  isNew: false,
  stockQuantity: 20,
  status: 'ACTIVE',
  image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
  description: '',
  sizes: 'XS, S, M, L, XL, 2XL',
  colors: [
    { name: 'Black', hex: '#252525', image: '' },
    { name: 'Beige', hex: '#B69A7A', image: '' },
  ],
};

export default function NewCollectionProductPage({ params }) {
  const { slug } = params;
  const [collection, setCollection] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/collections')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load collection categories.');
        }
        const availableCollections = data.collections || [];
        const selectedCollection = availableCollections.find((item) => item.slug === slug);
        if (!selectedCollection) throw new Error('The selected collection could not be found.');
        const defaultCategory = collectionProductCategories.find(
          (item) => item.slug === selectedCollection.slug
        ) || collectionProductCategories[0];

        setCollection(selectedCollection);
        setForm((current) => ({
          ...current,
          category: defaultCategory.title,
          categorySlug: defaultCategory.slug,
        }));
      })
      .catch((loadError) => setError(loadError.message || 'Failed to load collection options.'))
      .finally(() => setLoadingOptions(false));
  }, [slug]);

  const handleTitleChange = (event) => {
    const title = event.target.value;
    setForm((current) => ({
      ...current,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!collection) {
      setError('The selected collection could not be confirmed. Return to Collections and try again.');
      return;
    }
    if (form.isSale && (!form.originalPrice || Number(form.originalPrice) <= Number(form.price))) {
      setError('For a Sale product, enter a regular price higher than the sale price.');
      return;
    }

    setSaving(true);
    try {
      const colors = form.colors
        .map((color) => ({
          name: color.name.trim(),
          hex: color.hex || '#252525',
          ...(color.image.trim() ? { image: color.image.trim() } : {}),
        }))
        .filter((color) => color.name);
      const image = colors.find((color) => color.image)?.image || form.image.trim();
      const images = [...new Set([image, ...colors.map((color) => color.image).filter(Boolean)])];
      const payload = {
        title: form.title,
        slug: form.slug,
        gender: 'collection',
        category: form.category,
        categorySlug: form.categorySlug,
        collectionSlug: collection.slug,
        collectionSlugs: [collection.slug],
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        isSale: Boolean(form.isSale),
        isNew: Boolean(form.isNew),
        stockQuantity: Number(form.stockQuantity),
        status: form.status,
        image,
        images,
        description: form.description,
        sizes: form.sizes.split(',').map((size) => size.trim()).filter(Boolean),
        colors: colors.length ? colors : [{ name: 'Standard', hex: '#252525' }],
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create collection product.');
      }
      window.location.assign(`/admin/collections/${collection.slug}`);
    } catch (saveError) {
      setError(saveError.message || 'Failed to create collection product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="border-b border-[#B69A7A]/30 pb-4">
        <Link
          href={`/admin/collections/${slug}`}
          className="mb-2 inline-flex items-center gap-1.5 text-xs text-[#252525]/70 transition-colors hover:text-[#252525]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {collection?.title || 'Collection'}
        </Link>
        <h1 className="font-serif text-2xl font-bold text-[#252525] sm:text-3xl">
          Add Garment to Collection
        </h1>
        <p className="mt-1 text-xs font-light text-[#252525]/70">
          This product belongs only to {collection?.title || 'the selected collection'}; it will not appear in Women or Men department pages.
        </p>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-6 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
            Garment Title *
            <input
              type="text"
              required
              value={form.title}
              onChange={handleTitleChange}
              placeholder="e.g. Tailored Linen Blazer"
              className="mt-1.5 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs normal-case tracking-normal text-[#252525] focus:border-[#252525] focus:outline-none"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
            URL Slug *
            <input
              type="text"
              required
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="tailored-linen-blazer"
              className="mt-1.5 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 font-mono text-xs normal-case tracking-normal text-[#252525] focus:border-[#252525] focus:outline-none"
            />
          </label>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
          Category *
          <select
            required
            value={form.categorySlug}
            disabled={loadingOptions}
            onChange={(event) => {
              const selected = collectionProductCategories.find((item) => item.slug === event.target.value);
              setForm((current) => ({
                ...current,
                category: selected?.title || '',
                categorySlug: selected?.slug || '',
              }));
            }}
            className="mt-1.5 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs text-[#252525] focus:border-[#252525] focus:outline-none disabled:opacity-60"
          >
            <option value="">Select a category</option>
            {collectionProductCategories.map((item) => (
              <option key={item.slug} value={item.slug}>{item.title}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
            Retail Price (LKR) *
            <input
              type="number"
              required
              min="1"
              step="1"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs text-[#252525] focus:border-[#252525] focus:outline-none"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
            Original Price (LKR)
            <input
              type="number"
              min="1"
              step="1"
              required={form.isSale}
              value={form.originalPrice}
              onChange={(event) => setForm((current) => ({ ...current, originalPrice: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs text-[#252525] focus:border-[#252525] focus:outline-none"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
            Stock Quantity *
            <input
              type="number"
              required
              min="0"
              value={form.stockQuantity}
              onChange={(event) => setForm((current) => ({ ...current, stockQuantity: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs text-[#252525] focus:border-[#252525] focus:outline-none"
            />
          </label>
        </div>

        <fieldset className="space-y-2 border-t border-[#B69A7A]/25 pt-5">
          <legend className="text-xs font-semibold uppercase tracking-wider text-[#252525]">
            Product Sections
          </legend>
          <p className="text-[11px] text-[#252525]/60">
            Select either or both. These flags are independent of the collection assignment.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#B69A7A]/30 bg-white p-3">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(event) => setForm((current) => ({ ...current, isNew: event.target.checked }))}
                className="h-4 w-4 accent-[#252525]"
              />
              <span className="text-xs font-semibold text-[#252525]">New Arrivals</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#B69A7A]/30 bg-white p-3">
              <input
                type="checkbox"
                checked={form.isSale}
                onChange={(event) => setForm((current) => ({ ...current, isSale: event.target.checked }))}
                className="h-4 w-4 accent-[#252525]"
              />
              <span className="text-xs font-semibold text-[#252525]">Sale</span>
            </label>
          </div>
          {form.isSale && (
            <p className="text-[11px] text-[#252525]/65">
              Sale price is the product price; the original price must be higher.
            </p>
          )}
        </fieldset>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select
            aria-label="Publication status"
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            className="w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs text-[#252525] focus:border-[#252525] focus:outline-none"
          >
            <option value="ACTIVE">Status: ACTIVE</option>
            <option value="INACTIVE">Status: INACTIVE</option>
            <option value="ARCHIVED">Status: ARCHIVED</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
            Available Sizes (Comma Separated)
            <input
              type="text"
              value={form.sizes}
              onChange={(event) => setForm((current) => ({ ...current, sizes: event.target.value }))}
              placeholder="XS, S, M, L, XL, 2XL"
              className="mt-1.5 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs normal-case tracking-normal text-[#252525] focus:border-[#252525] focus:outline-none"
            />
          </label>
          <ProductColorFields
            colors={form.colors}
            onChange={(colors) => setForm((current) => ({ ...current, colors }))}
          />
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
          Product Description
          <textarea
            rows="3"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="mt-1.5 w-full rounded-xl border border-[#B69A7A]/40 bg-white px-4 py-2.5 text-xs normal-case tracking-normal text-[#252525] focus:border-[#252525] focus:outline-none"
          />
        </label>

        <div className="flex items-center justify-end gap-3 border-t border-[#B69A7A]/25 pt-4">
          <Link
            href={`/admin/collections/${slug}`}
            className="rounded-xl px-5 py-2.5 text-xs font-semibold text-[#252525] hover:bg-slate-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || loadingOptions || !collection}
            className="inline-flex items-center gap-2 rounded-xl bg-[#252525] px-7 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F5F0E8] shadow-md hover:bg-[#252525]/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Add to Collection'}
          </button>
        </div>
      </form>
    </div>
  );
}
