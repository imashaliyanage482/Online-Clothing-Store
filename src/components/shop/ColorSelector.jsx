import React from 'react';

export default function ColorSelector({ colors, selectedColor, onSelectColor }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-700">
        <span>Color: </span>
        <span className="font-normal text-slate-500 capitalize">{selectedColor?.name || 'Choose color'}</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => {
          const isSelected = selectedColor?.name === color.name;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelectColor(color)}
              title={color.name}
              className={`relative w-8 h-8 rounded-full border border-slate-300 focus:outline-none transition-transform ${
                isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex || '#000000' }}
            >
              <span className="sr-only">{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
