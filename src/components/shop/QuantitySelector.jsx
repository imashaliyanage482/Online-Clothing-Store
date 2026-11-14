import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ quantity, onIncrease, onDecrease, min = 1, max = 99 }) {
  return (
    <div className="flex items-center border border-[#B69A7A]/40 rounded-full overflow-hidden bg-[#FAF7F2] w-fit shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="px-3.5 py-2.5 text-[#252525] hover:text-[#B69A7A] disabled:opacity-30 hover:bg-[#B69A7A]/10 transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-[#252525] select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="px-3.5 py-2.5 text-[#252525] hover:text-[#B69A7A] disabled:opacity-30 hover:bg-[#B69A7A]/10 transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
