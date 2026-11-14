'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const inputClassName =
  'w-full px-3 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all';

export default function ProductColorFields({ colors, onChange }) {
  const updateColor = (index, updates) => {
    onChange(colors.map((color, colorIndex) =>
      colorIndex === index ? { ...color, ...updates } : color
    ));
  };

  return (
    <div className="space-y-4 sm:col-span-2">
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-[#252525] uppercase">
          Colors & Images
        </h2>
        <p className="text-[11px] text-[#252525]/60 mt-1">
          Add an image URL for each color. If left blank, the primary product image is used.
        </p>
      </div>

      {colors.map((color, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_120px_minmax(0,2fr)_auto] gap-3 items-end p-3 bg-white/70 rounded-xl border border-[#B69A7A]/25"
        >
          <label className="block text-[10px] font-semibold tracking-wider text-[#252525]/70 uppercase">
            Color name
            <input
              type="text"
              value={color.name}
              onChange={(event) => updateColor(index, { name: event.target.value })}
              placeholder="Black"
              className={`${inputClassName} mt-1.5`}
            />
          </label>

          <label className="block text-[10px] font-semibold tracking-wider text-[#252525]/70 uppercase">
            Swatch
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(color.hex) ? color.hex : '#252525'}
              onChange={(event) => updateColor(index, { hex: event.target.value })}
              aria-label={`${color.name || 'Product'} color swatch`}
              className="mt-1.5 w-full h-10 p-1 bg-white rounded-xl border border-[#B69A7A]/40 cursor-pointer"
            />
          </label>

          <div className="block text-[10px] font-semibold tracking-wider text-[#252525]/70 uppercase">
            <label>
              This color's image URL
              <input
                type="url"
                value={color.image || ''}
                onChange={(event) => updateColor(index, { image: event.target.value })}
                placeholder="https://example.com/black-product.jpg"
                aria-label={`Image URL for ${color.name || 'this color'}`}
                className={`${inputClassName} mt-1.5`}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => onChange(colors.filter((_, colorIndex) => colorIndex !== index))}
            disabled={colors.length <= 1}
            aria-label={`Remove ${color.name || 'color'}`}
            className="h-10 px-3 flex items-center justify-center gap-1.5 text-xs text-red-700 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="sm:hidden">Remove</span>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...colors, { name: '', hex: '#252525', image: '' }])}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#252525] bg-white rounded-full border border-[#B69A7A]/40 hover:bg-[#B69A7A]/15 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add another color
      </button>
    </div>
  );
}
