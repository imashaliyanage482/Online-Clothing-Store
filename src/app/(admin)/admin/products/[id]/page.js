'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, RefreshCw } from 'lucide-react';
import ProductColorFields from '@/components/admin/ProductColorFields';
import { collectionProductCategories } from '@/lib/db/collectionProductCategories';

export default function EditProductPage({ params }) {
  const { id } = params;

  const [categories, setCategories] = useState([]);
  const [collectionProductSlug, setCollectionProductSlug] = useState('');
  const [savedColorImages, setSavedColorImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    stockQuantity: 0,
    status: 'ACTIVE',
    image: '',
    additionalImages: [],
    description: '',
    sizes: '',
    colors: [{ name: '', hex: '#252525', image: '' }],
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`, { cache: 'no-store' }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to load product.');
        return data;
      }),
      fetch('/api/categories').then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to load categories.');
        return data;
      }),
    ])
      .then(([prodData, catData]) => {
        if (!catData.success) {
          throw new Error(catData.error || 'Failed to load categories.');
        }
        setCategories(catData.categories || []);

        if (prodData.success && prodData.product) {
          const p = prodData.product;
          setCollectionProductSlug(
            p.collectionSlug || (Array.isArray(p.collectionSlugs) ? p.collectionSlugs[0] : '') || ''
          );
          const colors = Array.isArray(p.colors) && p.colors.length
            ? p.colors.map((color) => ({
                name: color.name || '',
                hex: color.hex || '#252525',
                image: color.image || '',
              }))
            : [{ name: '', hex: '#252525', image: '' }];
          setSavedColorImages(colors.map((color) => color.image));
          setForm({
            title: p.title || '',
            slug: p.slug || '',
            gender: p.gender || 'women',
            category: p.category || '',
            categorySlug: p.categorySlug || '',
            price: p.price ?? '',
            originalPrice: p.originalPrice ?? '',
            isSale: Boolean(p.isSale),
            isNew: Boolean(p.isNew),
            stockQuantity: p.stockQuantity ?? 0,
            status: p.status || 'ACTIVE',
            image: p.image || '',
            additionalImages: Array.isArray(p.images)
              ? p.images
                  .map((image) => (typeof image === 'string' ? image : image?.url))
                  .filter(Boolean)
              : [],
            description: p.description || '',
            sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
            colors,
          });
        } else {
          setError('Product not found.');
        }
      })
      .catch((err) => setError(err.message || 'Failed to load product details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCategorySelect = (e) => {
    const slug = e.target.value;
    if (!slug) {
      setForm((prev) => ({ ...prev, category: '', categorySlug: '' }));
      return;
    }
    const cat = form.gender === 'collection'
      ? collectionProductCategories.find((item) => item.slug === slug)
      : categories.find((item) => item.slug === slug && item.gender === form.gender);
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

    if (form.isSale && (!form.originalPrice || Number(form.originalPrice) <= Number(form.price))) {
      setError('For a Sale product, enter a regular price higher than the sale price.');
      return;
    }

    setSaving(true);

    try {
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
      const primaryImage = form.image.trim();
      const productImages = [...new Set([
        primaryImage,
        ...form.additionalImages.map((image) => image.trim()).filter(Boolean),
        ...colorsArray.map((color) => color.image).filter(Boolean),
      ])];
      const changedColorImage = form.colors.find(
        (color, index) =>
          color.name.trim() &&
          color.image.trim() &&
          color.image.trim() !== savedColorImages[index]
      )?.image;
      const mainImage = changedColorImage || primaryImage;

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
        stockQuantity: Number(form.stockQuantity),
        status: form.status,
        image: mainImage,
        images: productImages,
        description: form.description,
        sizes: sizesArray.length ? sizesArray : ['One Size'],
        colors: colorsArray.length ? colorsArray : [{ name: 'Standard', hex: '#252525' }],
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        window.location.assign(form.gender === 'collection' && collectionProductSlug
          ? `/admin/collections/${collectionProductSlug}`
          : '/admin/products');
      } else {
        setError(data.error || 'Failed to update garment.');
      }
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#252525]/60">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B69A7A] mb-2" />
        Loading product data…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#B69A7A]/30">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-[#252525]/70 hover:text-[#252525] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
            Edit Garment
          </h1>
          <p className="text-xs text-[#252525]/70 font-light mt-0.5">
            Changes will immediately reflect on the live storefront.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Garment Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              className="w-full px-4 py-2.5 bg-white text-xs font-mono text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>
        </div>

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
              {form.gender === 'collection' && <option value="collection">Collection only</option>}
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
              {(form.gender === 'collection'
                ? collectionProductCategories
                : categories.filter((category) => category.gender === form.gender)).map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

        </div>

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
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Original Price (LKR)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.originalPrice}
              required={form.isSale}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Stock Quantity *
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
              Sizes (Comma Separated)
            </label>
            <input
              type="text"
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <ProductColorFields
            colors={form.colors}
            onChange={(colors) => setForm((prev) => ({ ...prev, colors }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
            Editorial Description
          </label>
          <textarea
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#B69A7A]/25">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#252525] hover:bg-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#252525] text-[#F5F0E8] text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-[#252525]/90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes…' : 'Save Garment Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
