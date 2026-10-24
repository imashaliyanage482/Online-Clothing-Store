'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { name: 'My Profile', href: '/account/profile', icon: User },
    { name: 'My Orders', href: '/account/orders', icon: Package },
    { name: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Account Settings', href: '/account/settings', icon: Settings },
    { name: 'Security', href: '/account/security', icon: Shield },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-xl border border-slate-200 p-4 h-fit shrink-0">
      <div className="mb-4 pb-4 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Customer Portal
        </span>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors mt-4 pt-3 border-t border-slate-100"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
