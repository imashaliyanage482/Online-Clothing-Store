import React from 'react';

export default function Input({
  label,
  error,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#252525] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#252525] placeholder-[#8E8880] bg-[#FAF7F2] border-[#B69A7A]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#B69A7A] focus:border-[#B69A7A] ${
          error ? 'border-red-600 focus:ring-red-600' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
