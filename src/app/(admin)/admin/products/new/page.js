'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import ProductColorFields from '@/components/admin/ProductColorFields';

export default function NewProductPage() {
  const [categories, setCategories] = useState([]);
  const [collectionContext, setCollectionContext] = useState(null);
  const [requestedCollectionSlug, setRequestedCollectionSlug] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    gender: 'women',
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
  });

  useEffect(() => {
    const requestedSlug = new URLSearchParams(window.location.search).get('collection');
    setRequestedCollectionSlug(requestedSlug || '');
    const requests = [fetch('/api/categories').then((response) => response.json())];
    if (requestedSlug) {
      requests.push(fetch('/api/collections').then((response) => response.json()));
    }

    Promise.all(requests)
      .then(([catData, collectionData]) => {
        if (!catData.success) throw new Error(catData.error || 'Failed to load categories.');
        if (requestedSlug) {
          if (!collectionData.success) throw new Error(collectionData.error || 'Failed to load collections.');
          const collection = collectionData.collections?.find((item) => item.slug === requestedSlug);
          if (!collection) throw new Error('The selected collection could not be found.');
          setCollectionContext(collection);
        }
        if (catData.success && catData.categories?.length) {
          setCategories(catData.categories);
          const defaultCat = catData.categories.find((category) => category.gender === 'women');
          setForm((prev) => ({
            ...prev,
            category: defaultCat?.title || '',
            categorySlug: defaultCat?.slug || '',
          }));
        }
      })
      .catch((err) => setError(err.message || 'Failed to load product options.'))
      .finally(() => setLoadingOptions(false));
  }, []);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: autoSlug,
    }));
  };

  const handleCategorySelect = (e) => {
    const slug = e.target.value;
    if (!slug) {
      setForm((prev) => ({ ...prev, category: '', categorySlug: '' }));
      return;
    }
    const cat = categories.find((c) => c.slug === slug && c.gender === form.gender);
    if (cat) {
      setForm((prev) => ({
        ...prev,
        category: cat.title,
        categorySlug: cat.slug,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (requestedCollectionSlug && !collectionContext) {
      setError('The selected collection could not be confirmed. Return to Collections and try again.');
      return;
    }

    if (form.isSale && (!form.originalPrice || Number(form.originalPrice) <= Number(form.price))) {
      setError('For a Sale product, enter a regular price higher than the sale price.');
      return;
    }

    setLoading(true);

    try {
      // Parse sizes array
      const sizesArray = form.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const colorsArray = form.colors
        .map((color) => ({
          name: color.name.trim(),
          hex: color.hex || '#252525',
          ...(color.image.trim() ? { image: color.image.trim() } : {}),
        }))
        .filter((color) => color.name);
      const primaryImage = colorsArray.find((color) => color.image)?.image || form.image.trim();
      const productImages = [...new Set([
        primaryImage,
        ...colorsArray.map((color) => color.image).filter(Boolean),
      ])];

      const payload = {
        title: form.title,
        slug: form.slug,
        gender: form.gender,
        category: form.category,
        categorySlug: form.categorySlug,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        isSale: Boolean(form.isSale),
        isNew: Boolean(form.isNew),
        collectionSlugs: collectionContext ? [collectionContext.slug] : [],
        collectionSlug: collectionContext?.slug || null,
        stockQuantity: Number(form.stockQuantity),
        status: form.status,
        image: primaryImage,
        images: productImages,
        description: form.description,
        sizes: sizesArray.length ? sizesArray : ['One Size'],
        colors: colorsArray.length ? colorsArray : [{ name: 'Standard', hex: '#252525' }],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        window.location.assign(collectionContext
          ? `/admin/collections/${collectionContext.slug}`
          : '/admin/products');
      } else {
        setError(data.error || 'Failed to create product.');
      }
    } catch (err) {
      setError(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#B69A7A]/30">
        <div>
          <Link
            href={collectionContext
              ? `/admin/collections/${collectionContext.slug}`
              : '/admin/products'}
            className="inline-flex items-center gap-1.5 text-xs text-[#252525]/70 hover:text-[#252525] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{collectionContext ? 'Back to Collection' : 'Back to Products'}</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
            Add New Garment
          </h1>
          <p className="text-xs text-[#252525]/70 font-light mt-0.5">
            Add the product to its department catalog{collectionContext ? ` and ${collectionContext.title}` : ''}.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#B69A7A]/30 shadow-sm space-y-6">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Garment Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={handleTitleChange}
              placeholder="e.g. Pure Mulberry Silk Slip Dress"
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="pure-mulberry-silk-slip-dress"
              className="w-full px-4 py-2.5 bg-white text-xs font-mono text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Gender and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Department *
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm((prev) => ({
                ...prev,
                gender: e.target.value,
                category: '',
                categorySlug: '',
              }))}
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Category *
            </label>
            <select
              required
              value={form.categorySlug}
              onChange={handleCategorySelect}
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            >
              <option value="">Select a category</option>
              {categories.filter((category) => category.gender === form.gender).map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Product Sections */}
        <fieldset className="space-y-2 border-t border-[#B69A7A]/25 pt-5">
          <legend className="text-xs font-semibold tracking-wider text-[#252525] uppercase">
            Product Section
          </legend>
          <p className="text-[11px] text-[#252525]/60">
            Choose New Arrivals, Sale, both, or neither.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-[#B69A7A]/30 bg-white p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => setForm((prev) => ({ ...prev, isNew: e.target.checked }))}
                className="h-4 w-4 accent-[#252525]"
              />
              <span className="text-xs font-semibold text-[#252525]">New Arrivals</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-[#B69A7A]/30 bg-white p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isSale}
                onChange={(e) => setForm((prev) => ({ ...prev, isSale: e.target.checked }))}
                className="h-4 w-4 accent-[#252525]"
              />
              <span className="text-xs font-semibold text-[#252525]">Sale</span>
            </label>
          </div>
          {form.isSale && (
            <p className="text-[11px] text-[#252525]/65">
              Sale price is the product price. The regular price must be higher.
            </p>
          )}
        </fieldset>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Retail Price (LKR) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 14500"
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Original / Regular Price (LKR)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.originalPrice}
              required={form.isSale}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              placeholder={form.isSale ? 'Required for sale pricing' : 'Leave blank if not on sale'}
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Initial Stock Quantity *
            </label>
            <input
              type="number"
              required
              min="0"
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Publication Status */}
        <div>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            >
              <option value="ACTIVE">Status: ACTIVE</option>
              <option value="INACTIVE">Status: INACTIVE</option>
              <option value="ARCHIVED">Status: ARCHIVED</option>
            </select>
        </div>

        {/* Sizes & Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Available Sizes (Comma Separated)
            </label>
            <input
              type="text"
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              placeholder="XS, S, M, L, XL, 2XL"
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <ProductColorFields
            colors={form.colors}
            onChange={(colors) => setForm((prev) => ({ ...prev, colors }))}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
            Editorial Garment Description
          </label>
          <textarea
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe fabric composition, tailoring details, fit, and origin…"
            className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
          />
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#B69A7A]/25">
          <Link
            href={collectionContext
              ? `/admin/collections/${collectionContext.slug}`
              : '/admin/products'}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#252525] hover:bg-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || loadingOptions}
            className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#252525] text-[#F5F0E8] text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-[#252525]/90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loadingOptions ? 'Loading…' : loading ? 'Creating Garment…' : 'Publish Garment'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
