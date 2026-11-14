'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function CustomerHeader({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 sm:p-8 mb-6 shadow-sm text-[#252525]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block mb-1">
            CLIENT ATELIER
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525] tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-xs sm:text-sm text-[#252525]/70 font-light">{subtitle}</p>}
        </div>
        {user && (
          <div className="text-sm text-[#252525]/80 sm:text-right">
            <span className="block font-serif font-bold text-[#252525]">{user.name}</span>
            <span className="text-xs text-[#252525]/60 font-light">{user.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
