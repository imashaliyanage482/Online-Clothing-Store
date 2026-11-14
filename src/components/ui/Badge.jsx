import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[#252525] text-[#F5F0E8]',
    secondary: 'bg-[#FAF7F2] text-[#252525] border border-[#B69A7A]/50',
    beige: 'bg-[#B69A7A]/20 text-[#252525] border border-[#B69A7A]',
    success: 'bg-[#B69A7A]/20 text-[#252525] border border-[#B69A7A]',
    warning: 'bg-[#FAF7F2] text-[#252525] border border-[#B69A7A]',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-[#F5F0E8] text-[#252525] border border-[#B69A7A]/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
