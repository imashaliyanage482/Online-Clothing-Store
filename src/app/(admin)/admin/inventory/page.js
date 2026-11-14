'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Boxes,
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle,
  Search,
  Check,
  TrendingDown,
  PackageCheck,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'low' | 'out' | 'healthy'
  const [genderFilter, setGenderFilter] = useState('all'); // 'all' | 'women' | 'men'
  const [threshold, setThreshold] = useState(8); // customizable low-stock threshold
  const [sortBy, setSortBy] = useState('stock-asc'); // 'stock-asc' | 'stock-desc' | 'name-asc' | 'price-desc'
  const [editingInputId, setEditingInputId] = useState(null);
  const [customInputValue, setCustomInputValue] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setInventory(data.inventory || []);
      }
    } catch (err) {
      console.error('Failed fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (product, newQuantity) => {
    const finalQuantity = Math.max(0, parseInt(newQuantity) || 0);
    setUpdatingId(product.id);

    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, stockQuantity: finalQuantity }),
      });
      const data = await res.json();

      if (data.success) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  stockQuantity: finalQuantity,
                  isLowStock: finalQuantity <= threshold && finalQuantity > 0,
                  isOutOfStock: finalQuantity === 0,
                }
              : item
          )
        );
        setNotification(`Updated stock for "${product.title}" to ${finalQuantity} units.`);
        setTimeout(() => setNotification(''), 3500);
        setEditingInputId(null);
      } else {
        alert(data.error || 'Failed to update stock');
      }
    } catch (err) {
      alert('Error updating stock');
    } finally {
      setUpdatingId(null);
    }
  };

  // Summary Metrics
  const totalSKUs = inventory.length;
  const totalUnits = useMemo(
    () => inventory.reduce((sum, item) => sum + (Number(item.stockQuantity) || 0), 0),
    [inventory]
  );
  const outOfStockCount = useMemo(
    () => inventory.filter((item) => (Number(item.stockQuantity) || 0) === 0).length,
    [inventory]
  );
  const lowStockCount = useMemo(
    () =>
      inventory.filter((item) => {
        const qty = Number(item.stockQuantity) || 0;
        return qty > 0 && qty <= threshold;
      }).length,
    [inventory, threshold]
  );
  const healthyStockCount = useMemo(
    () => inventory.filter((item) => (Number(item.stockQuantity) || 0) > threshold).length,
    [inventory, threshold]
  );

  // Filtered & Sorted inventory
  const filtered = useMemo(() => {
    return inventory
      .filter((item) => {
        const qty = Number(item.stockQuantity) || 0;

        // Status Filter
        if (statusFilter === 'out' && qty !== 0) return false;
        if (statusFilter === 'low' && (qty === 0 || qty > threshold)) return false;
        if (statusFilter === 'healthy' && qty <= threshold) return false;

        // Gender Filter
        if (genderFilter !== 'all' && item.gender !== genderFilter) return false;

        // Search Filter
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          const matchId = String(item.id || '').toLowerCase().includes(q);
          if (!matchTitle && !matchCategory && !matchId) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const qtyA = Number(a.stockQuantity) || 0;
        const qtyB = Number(b.stockQuantity) || 0;
        if (sortBy === 'stock-asc') return qtyA - qtyB;
        if (sortBy === 'stock-desc') return qtyB - qtyA;
        if (sortBy === 'name-asc') return (a.title || '').localeCompare(b.title || '');
        if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
        return 0;
      });
  }, [inventory, statusFilter, genderFilter, search, threshold, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#B69A7A]/30">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-1">
            WAREHOUSE OPERATIONS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
            Stock & Inventory Control
          </h1>
          <p className="text-xs text-[#252525]/70 mt-1 font-light">
            Monitor SKU inventory quantities, restock garments, and respond to low-stock safety thresholds.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-[#B69A7A]/40 rounded-xl text-xs font-semibold text-[#252525] hover:bg-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#B69A7A]' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-medium text-[#252525]/70">Total Garments</div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#252525] mt-1">{totalSKUs} SKUs</div>
            <div className="text-[10px] text-[#252525]/50 mt-0.5">{totalUnits} total units in warehouse</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F5F0E8] border border-[#B69A7A]/30 flex items-center justify-center text-[#252525]">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-medium text-emerald-800">Healthy Stock</div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-emerald-900 mt-1">
              {healthyStockCount} SKUs
            </div>
            <div className="text-[10px] text-emerald-700/80 mt-0.5">&gt; {threshold} units remaining</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-medium text-amber-800">Low Stock Warning</div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-amber-900 mt-1">
              {lowStockCount} SKUs
            </div>
            <div className="text-[10px] text-amber-700/80 mt-0.5">&le; {threshold} units safety level</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-medium text-rose-800">Out of Stock</div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-rose-900 mt-1">
              {outOfStockCount} SKUs
            </div>
            <div className="text-[10px] text-rose-700/80 mt-0.5">0 units available</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-800">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#B69A7A]/30 space-y-3">
        {/* Row 1: Search & Threshold & Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#B69A7A] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU title, ID, or category…"
              className="w-full pl-10 pr-4 py-2 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Low-Stock Threshold Selector */}
            <div className="flex items-center gap-1.5 text-xs text-[#252525]/80">
              <span className="font-semibold text-[11px]">Warning Level:</span>
              <select
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-[#B69A7A]/40 rounded-xl text-xs font-bold text-[#252525] outline-none"
              >
                <option value={5}>&le; 5 units</option>
                <option value={8}>&le; 8 units (Current)</option>
                <option value={10}>&le; 10 units</option>
                <option value={15}>&le; 15 units</option>
                <option value={20}>&le; 20 units</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs text-[#252525]/80">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#B69A7A]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-[#B69A7A]/40 rounded-xl text-xs font-medium text-[#252525] outline-none"
              >
                <option value="stock-asc">Stock: Lowest First</option>
                <option value="stock-desc">Stock: Highest First</option>
                <option value="name-asc">Title: A to Z</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Status & Department Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#B69A7A]/20">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-[#252525]/70 mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Stock', count: totalSKUs },
              { id: 'low', label: `Low Stock (≤ ${threshold})`, count: lowStockCount },
              { id: 'out', label: 'Out of Stock (0)', count: outOfStockCount },
              { id: 'healthy', label: `Healthy (> ${threshold})`, count: healthyStockCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-[#252525] text-white shadow-sm'
                    : 'bg-white border border-[#B69A7A]/30 text-[#252525]/70 hover:text-[#252525]'
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-[10px] opacity-80">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#252525]/70 mr-1">Dept:</span>
            {['all', 'women', 'men'].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium capitalize transition-all ${
                  genderFilter === g
                    ? 'bg-[#B69A7A] text-[#252525] font-bold'
                    : 'bg-white border border-[#B69A7A]/30 text-[#252525]/70 hover:text-[#252525]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#252525]">
            <thead className="bg-[#F5F0E8] text-[10.5px] font-bold uppercase tracking-wider text-[#252525]/70 border-b border-[#B69A7A]/25">
              <tr>
                <th className="px-5 py-3.5">SKU / Garment</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Unit Price (LKR)</th>
                <th className="px-5 py-3.5">Available Stock</th>
                <th className="px-5 py-3.5">Inventory Status</th>
                <th className="px-5 py-3.5 text-right">Quick Restock / Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B69A7A]/20">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#B69A7A] mb-2" />
                    Auditing warehouse inventory…
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((item) => {
                  const qty = Number(item.stockQuantity) || 0;
                  const isOut = qty === 0;
                  const isLow = !isOut && qty <= threshold;
                  const isEditing = editingInputId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#252525]">
                        <div className="line-clamp-1 max-w-sm">{item.title}</div>
                        <div className="text-[10px] text-[#252525]/50 font-mono mt-0.5">ID: {item.id}</div>
                      </td>
                      <td className="px-5 py-4 font-medium text-[#252525]/80">{item.category}</td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#B69A7A]/20 text-[#252525] border border-[#B69A7A]/40">
                          {item.gender}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-[#252525]">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-5 py-4 font-bold text-sm">
                        <span
                          className={
                            isOut
                              ? 'text-rose-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }
                        >
                          {qty} units
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isOut
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : isLow
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock Warning' : 'Healthy Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5 bg-white border border-[#B69A7A]/40 rounded-xl p-1 shadow-sm">
                          <button
                            disabled={updatingId === item.id || qty <= 0}
                            onClick={() => handleAdjustStock(item, qty - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#252525] transition-colors cursor-pointer disabled:opacity-30"
                            title="Reduce stock (-1)"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                autoFocus
                                value={customInputValue}
                                onChange={(e) => setCustomInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAdjustStock(item, customInputValue);
                                  if (e.key === 'Escape') setEditingInputId(null);
                                }}
                                className="w-14 px-1 py-0.5 text-center font-mono text-xs font-bold border border-[#B69A7A] rounded outline-none"
                              />
                              <button
                                onClick={() => handleAdjustStock(item, customInputValue)}
                                className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingInputId(item.id);
                                setCustomInputValue(String(qty));
                              }}
                              title="Click to type exact quantity"
                              className="px-2 py-0.5 font-mono text-xs font-bold text-[#252525] hover:bg-[#FAF7F2] rounded cursor-pointer"
                            >
                              {qty}
                            </button>
                          )}

                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleAdjustStock(item, qty + 5)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#252525] transition-colors cursor-pointer disabled:opacity-30"
                            title="Restock (+5 units)"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleAdjustStock(item, qty + 10)}
                            className="px-2 py-1 text-[10px] font-bold bg-[#FAF7F2] hover:bg-[#B69A7A]/20 text-[#252525] rounded-lg border border-[#B69A7A]/30 transition-colors cursor-pointer disabled:opacity-30"
                            title="Quick Restock +10"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#252525]/60">
                    No items found matching the selected filters.
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
