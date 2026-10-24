'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, Bell } from 'lucide-react';

export default function AdminHeader({ title, description }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-900">{user?.name || 'Administrator'}</div>
            <div className="text-slate-400">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
