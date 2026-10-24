import React from 'react';

export default function SizeSelector({ sizes, selectedSize, onSelectSize }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-700">
        <span>Select Size</span>
        <span className="text-amber-600 cursor-pointer hover:underline normal-case font-normal text-xs">
          Size Guide
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`h-10 min-w-[2.5rem] px-3.5 flex items-center justify-center text-xs font-semibold rounded-lg border transition-all ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
