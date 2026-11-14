import React from 'react';

/**
 * Luxury Fashion Button Component
 * Color System:
 *   - Primary:   bg-[#252525] text-[#F5F0E8] hover:bg-[#B69A7A] hover:text-[#252525]
 *   - Secondary: bg-[#F5F0E8] text-[#252525] border border-[#B69A7A] hover:bg-[#B69A7A]/15
 *   - Outline:   bg-transparent text-[#252525] border border-[#252525] hover:bg-[#252525] hover:text-[#F5F0E8]
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B69A7A] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-[#252525] text-[#F5F0E8] hover:bg-[#B69A7A] hover:text-[#252525] shadow-sm',
    secondary:
      'bg-[#F5F0E8] text-[#252525] border border-[#B69A7A] hover:bg-[#B69A7A]/20',
    outline:
      'border border-[#252525] bg-transparent text-[#252525] hover:bg-[#252525] hover:text-[#F5F0E8]',
    beige:
      'bg-[#B69A7A] text-[#252525] hover:bg-[#252525] hover:text-[#F5F0E8]',
    ghost:
      'bg-transparent text-[#252525] hover:bg-[#B69A7A]/15',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-xs sm:text-sm',
    lg: 'px-8 py-3.5 text-sm font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
