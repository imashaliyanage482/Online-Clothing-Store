'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function CustomerHeader({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {user && (
          <div className="text-sm text-slate-600 sm:text-right">
            <span className="block font-medium text-slate-900">{user.name}</span>
            <span className="text-xs text-slate-400">{user.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
