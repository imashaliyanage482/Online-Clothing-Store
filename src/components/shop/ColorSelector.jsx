import React from 'react';

export default function ColorSelector({ colors, selectedColor, onSelectColor }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#252525]">
        <span>Color: </span>
        <span className="font-normal text-[#B69A7A] capitalize">{selectedColor?.name || 'Choose color'}</span>
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
              className={`relative w-8 h-8 rounded-full border border-[#B69A7A]/40 focus:outline-none transition-transform cursor-pointer ${
                isSelected ? 'ring-2 ring-offset-2 ring-[#252525] scale-110' : 'hover:scale-105'
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
