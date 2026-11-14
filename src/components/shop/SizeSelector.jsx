import React from 'react';

export default function SizeSelector({ sizes, selectedSize, onSelectSize }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#252525]">
        <span>Select Size</span>
        <button
          type="button"
          className="text-[#B69A7A] hover:underline normal-case font-medium text-xs cursor-pointer"
        >
          Atelier Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`h-10 min-w-[2.75rem] px-3.5 flex items-center justify-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#252525] bg-[#252525] text-[#F5F0E8] shadow-sm'
                  : 'border-[#B69A7A]/40 bg-[#FAF7F2] text-[#252525] hover:border-[#B69A7A]'
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
