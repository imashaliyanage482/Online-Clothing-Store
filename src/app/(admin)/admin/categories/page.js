'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  X,
  AlertCircle,
  FolderTree,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function AdminCategoriesAndCollectionsPage() {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'collections'
  const [genderFilter, setGenderFilter] = useState('all'); // 'all' | 'women' | 'men'

  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // Collections state
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [colModalOpen, setColModalOpen] = useState(false);
  const [editCollection, setEditCollection] = useState(null);
  const [productCounts, setProductCounts] = useState({});

  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Category Form
  const [catForm, setCatForm] = useState({
    title: '',
    slug: '',
    gender: 'women',
    description: '',
    cta: '',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    isActive: true,
  });

  // Collection Form
  const [colForm, setColForm] = useState({
    title: '',
    slug: '',
    description: '',
    cta: '',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    isActive: true,
  });

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed fetching categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchCollections = async () => {
    setCollectionsLoading(true);
    try {
      const [colRes, prodRes] = await Promise.all([
        fetch('/api/collections'),
        fetch('/api/products'),
      ]);
      const [colData, prodData] = await Promise.all([colRes.json(), prodRes.json()]);

      if (colData.success) {
        const colList = colData.collections || [];
        setCollections(colList);

        if (prodData.success) {
          const counts = {};
          colList.forEach((c) => {
            counts[c.slug] = (prodData.products || []).filter((p) =>
              (p.collectionSlugs || [p.collectionSlug].filter(Boolean)).includes(c.slug)
            ).length;
          });
          setProductCounts(counts);
        }
      }
    } catch (err) {
      console.error('Failed fetching collections:', err);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const refreshAll = () => {
    fetchCategories();
    fetchCollections();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // ── CATEGORY HANDLERS ──
  const openAddCatModal = () => {
    setEditCategory(null);
    setCatForm({
      title: '',
      slug: '',
      gender: genderFilter === 'men' ? 'men' : 'women',
      description: '',
      cta: '',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setCatModalOpen(true);
  };

  const openEditCatModal = (cat) => {
    setEditCategory(cat);
    setCatForm({
      title: cat.title,
      slug: cat.slug,
      gender: cat.gender || 'women',
      description: cat.description || '',
      cta: cat.cta || '',
      image: cat.image || '',
      displayOrder: cat.displayOrder || 1,
      isActive: cat.isActive !== false,
    });
    setCatModalOpen(true);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editCategory ? `/api/categories/${editCategory.id}` : '/api/categories';
      const method = editCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm),
      });
      const data = await res.json();

      if (data.success) {
        setNotification(editCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setTimeout(() => setNotification(''), 4000);
        setCatModalOpen(false);
        fetchCategories();
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (err) {
      alert('Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCat = async (id, title) => {
    if (!confirm(`Are you sure you want to delete the category "${title}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification(`Deleted "${title}"`);
        setTimeout(() => setNotification(''), 3000);
        fetchCategories();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  // ── COLLECTION HANDLERS ──
  const openAddColModal = () => {
    setEditCollection(null);
    setColForm({
      title: '',
      slug: '',
      description: '',
      cta: '',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      displayOrder: collections.length + 1,
      isActive: true,
    });
    setColModalOpen(true);
  };

  const openEditColModal = (col) => {
    setEditCollection(col);
    setColForm({
      title: col.title,
      slug: col.slug,
      description: col.description || '',
      cta: col.cta || '',
      image: col.image || '',
      displayOrder: col.displayOrder || 1,
      isActive: col.isActive !== false,
    });
    setColModalOpen(true);
  };

  const handleColSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editCollection ? `/api/collections/${editCollection.id}` : '/api/collections';
      const method = editCollection ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colForm),
      });
      const data = await res.json();

      if (data.success) {
        setNotification(editCollection ? 'Collection updated successfully!' : 'Collection created successfully!');
        setTimeout(() => setNotification(''), 4000);
        setColModalOpen(false);
        fetchCollections();
      } else {
        alert(data.error || 'Failed to save collection');
      }
    } catch (err) {
      alert('Error saving collection');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCol = async (id, title) => {
    if (!confirm(`Are you sure you want to delete collection "${title}"?`)) return;
    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification(`Deleted collection "${title}"`);
        setTimeout(() => setNotification(''), 3000);
        fetchCollections();
      } else {
        alert(data.error || 'Failed to delete collection');
      }
    } catch (err) {
      alert('Error deleting collection');
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (genderFilter === 'women') return c.gender === 'women';
    if (genderFilter === 'men') return c.gender === 'men';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#B69A7A]/30">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-1">
            CATALOG ARCHITECTURE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
            Categories & Collections
          </h1>
          <p className="text-xs text-[#252525]/70 mt-1 font-light">
            Manage your apparel departments, categories, and seasonal curated collections in one unified workspace.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshAll}
            disabled={categoriesLoading || collectionsLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FAF7F2] border border-[#B69A7A]/40 rounded-xl text-xs font-semibold text-[#252525] hover:bg-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                categoriesLoading || collectionsLoading ? 'animate-spin text-[#B69A7A]' : ''
              }`}
            />
            <span>Refresh</span>
          </button>

          {activeTab === 'categories' ? (
            <button
              onClick={openAddCatModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#252525] hover:bg-[#3d3d3d] text-[#FAF7F2] rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#B69A7A]" />
              <span>Add Category</span>
            </button>
          ) : (
            <button
              onClick={openAddColModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#252525] hover:bg-[#3d3d3d] text-[#FAF7F2] rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#B69A7A]" />
              <span>Add Collection</span>
            </button>
          )}
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B69A7A]/20 pb-2">
        <div className="inline-flex p-1 bg-[#FAF7F2] border border-[#B69A7A]/30 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-[#252525] text-[#FAF7F2] shadow-sm'
                : 'text-[#252525]/70 hover:text-[#252525]'
            }`}
          >
            <FolderTree className="w-4 h-4 text-[#B69A7A]" />
            <span>Garment Categories</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-[#B69A7A]/20 text-inherit">
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collections')}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'collections'
                ? 'bg-[#252525] text-[#FAF7F2] shadow-sm'
                : 'text-[#252525]/70 hover:text-[#252525]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#B69A7A]" />
            <span>Curated Collections</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-[#B69A7A]/20 text-inherit">
              {collections.length}
            </span>
          </button>
        </div>

        {/* Gender Filter (Only for Categories tab) */}
        {activeTab === 'categories' && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {['all', 'women', 'men'].map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  genderFilter === gender
                    ? 'bg-[#B69A7A] text-[#252525]'
                    : 'bg-[#FAF7F2] border border-[#B69A7A]/30 text-[#252525]/70 hover:text-[#252525]'
                }`}
              >
                {gender === 'all' ? 'All Genders' : gender}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── TAB 1: CATEGORIES TABLE ── */}
      {activeTab === 'categories' && (
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#252525]">
              <thead className="bg-[#F5F0E8] text-[10.5px] font-bold uppercase tracking-wider text-[#252525]/70 border-b border-[#B69A7A]/25">
                <tr>
                  <th className="px-5 py-3.5">Category Title</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">URL Slug & Route</th>
                  <th className="px-5 py-3.5 text-center">Display Order</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B69A7A]/20">
                {categoriesLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B69A7A] mb-2" />
                      Loading categories…
                    </td>
                  </tr>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((c) => (
                    <tr key={c.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#B69A7A]/30 bg-[#EBE3D5]">
                            {c.image ? (
                              <Image
                                src={c.image}
                                alt={c.title}
                                fill
                                sizes="40px"
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] text-[#252525]/40 font-mono">
                                No Pic
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-[#252525]">{c.title}</p>
                            <p className="text-[10.5px] text-[#252525]/60 line-clamp-1 max-w-xs font-light">
                              {c.description || 'No description provided'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#B69A7A]/20 text-[#252525] border border-[#B69A7A]/40">
                          {c.gender}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-[#252525]/70">
                        /{c.gender}/{c.slug}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-center">
                        #{c.displayOrder || 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                            c.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {c.isActive !== false ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${c.gender}/${c.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#252525]/70 hover:text-[#B69A7A] hover:bg-[#B69A7A]/20 rounded-lg transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => openEditCatModal(c)}
                            className="p-1.5 text-[#252525]/80 hover:text-[#B69A7A] hover:bg-[#B69A7A]/20 rounded-lg transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCat(c.id, c.title)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                      No categories found for selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: COLLECTIONS TABLE ── */}
      {activeTab === 'collections' && (
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#252525]">
              <thead className="bg-[#F5F0E8] text-[10.5px] font-bold uppercase tracking-wider text-[#252525]/70 border-b border-[#B69A7A]/25">
                <tr>
                  <th className="px-5 py-3.5">Curated Collection</th>
                  <th className="px-5 py-3.5">URL Route</th>
                  <th className="px-5 py-3.5 text-center">Products</th>
                  <th className="px-5 py-3.5 text-center">Display Order</th>
                  <th className="px-5 py-3.5">Visibility</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B69A7A]/20">
                {collectionsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B69A7A] mb-2" />
                      Loading collections…
                    </td>
                  </tr>
                ) : collections.length > 0 ? (
                  collections.map((col) => (
                    <tr key={col.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#B69A7A]/30 bg-[#EBE3D5]">
                            {col.image ? (
                              <Image
                                src={col.image}
                                alt={col.title}
                                fill
                                sizes="48px"
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] text-[#252525]/40 font-mono">
                                No Pic
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-[#252525]">{col.title}</p>
                            <p className="text-[10.5px] text-[#252525]/60 line-clamp-1 max-w-sm font-light">
                              {col.description || 'Curated editorial capsule'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-[#252525]/70">
                        /collections/{col.slug}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B69A7A]/15 text-[#252525]">
                          {productCounts[col.slug] ?? 0} SKUs
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-center">
                        #{col.displayOrder || 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                            col.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {col.isActive !== false ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/collections/${col.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#252525]/70 hover:text-[#B69A7A] hover:bg-[#B69A7A]/20 rounded-lg transition-colors"
                            title="View Public Collection"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => openEditColModal(col)}
                            className="p-1.5 text-[#252525]/80 hover:text-[#B69A7A] hover:bg-[#B69A7A]/20 rounded-lg transition-colors cursor-pointer"
                            title="Edit Collection"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCol(col.id, col.title)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Collection"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                      No collections found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: CATEGORY ADD/EDIT ── */}
      {catModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/40 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-[#B69A7A]/25">
              <h2 className="font-serif text-lg font-bold text-[#252525]">
                {editCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1 text-[#252525]/60 hover:text-[#252525] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCatSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Category Title
                </label>
                <input
                  type="text"
                  required
                  value={catForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setCatForm((prev) => ({
                      ...prev,
                      title,
                      slug: editCategory ? prev.slug : slug,
                    }));
                  }}
                  placeholder="e.g. Silk Tops"
                  className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Department / Gender
                  </label>
                  <select
                    value={catForm.gender}
                    onChange={(e) => setCatForm((prev) => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Route Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={catForm.slug}
                    onChange={(e) => setCatForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="silk-tops"
                    className="w-full px-3.5 py-2 bg-white font-mono text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catForm.description}
                  onChange={(e) => setCatForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description for category banner..."
                  className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  value={catForm.image}
                  onChange={(e) => setCatForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={catForm.displayOrder}
                    onChange={(e) =>
                      setCatForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="catIsActive"
                    checked={catForm.isActive}
                    onChange={(e) => setCatForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-[#B69A7A]/40 text-[#252525] focus:ring-0"
                  />
                  <label htmlFor="catIsActive" className="text-xs font-semibold text-[#252525] cursor-pointer">
                    Active in Navigation Menu
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#B69A7A]/25">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#B69A7A]/40 rounded-xl text-xs font-semibold text-[#252525] hover:bg-[#F5F0E8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#252525] hover:bg-[#3d3d3d] text-[#FAF7F2] rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: COLLECTION ADD/EDIT ── */}
      {colModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/40 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-[#B69A7A]/25">
              <h2 className="font-serif text-lg font-bold text-[#252525]">
                {editCollection ? 'Edit Collection' : 'Create Curated Collection'}
              </h2>
              <button
                onClick={() => setColModalOpen(false)}
                className="p-1 text-[#252525]/60 hover:text-[#252525] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleColSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Collection Title
                </label>
                <input
                  type="text"
                  required
                  value={colForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setColForm((prev) => ({
                      ...prev,
                      title,
                      slug: editCollection ? prev.slug : slug,
                    }));
                  }}
                  placeholder="e.g. Summer Resort Edit"
                  className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Route Slug
                </label>
                <input
                  type="text"
                  required
                  value={colForm.slug}
                  onChange={(e) => setColForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="summer-resort-edit"
                  className="w-full px-3.5 py-2 bg-white font-mono text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={colForm.description}
                  onChange={(e) => setColForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Editorial capsule description..."
                  className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  value={colForm.image}
                  onChange={(e) => setColForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={colForm.displayOrder}
                    onChange={(e) =>
                      setColForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full px-3.5 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="colIsActive"
                    checked={colForm.isActive}
                    onChange={(e) => setColForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-[#B69A7A]/40 text-[#252525] focus:ring-0"
                  />
                  <label htmlFor="colIsActive" className="text-xs font-semibold text-[#252525] cursor-pointer">
                    Live On Storefront
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#B69A7A]/25">
                <button
                  type="button"
                  onClick={() => setColModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#B69A7A]/40 rounded-xl text-xs font-semibold text-[#252525] hover:bg-[#F5F0E8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#252525] hover:bg-[#3d3d3d] text-[#FAF7F2] rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editCollection ? 'Save Changes' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
