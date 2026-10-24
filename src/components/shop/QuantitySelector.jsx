import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ quantity, onIncrease, onDecrease, min = 1, max = 99 }) {
  return (
    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white w-fit shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-slate-900 select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
