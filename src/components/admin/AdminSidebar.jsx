'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  FolderTree,
  Sparkles,
  Boxes,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminSidebar({ onNavigate }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Shirt },
    { name: 'Categories & Collections', href: '/admin/categories', icon: FolderTree },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    if (onNavigate) onNavigate();
  };

  const isActive = (href) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full min-h-0 w-64 shrink-0 flex-col border-r border-[#B69A7A]/30 bg-[#252525] text-[#F5F0E8]">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#B69A7A]/25">
        <Link href="/admin/dashboard" onClick={handleLinkClick} className="flex flex-col">
          <span className="font-serif text-lg font-bold tracking-wider text-[#F5F0E8] uppercase leading-none">
            FASHION<span className="text-[#B69A7A]">ADMIN</span>
          </span>
          <span className="text-[7.5px] tracking-[0.3em] text-[#B69A7A] uppercase mt-0.5">
            ATELIER OPERATIONS
          </span>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="text-[#F5F0E8]/70 hover:text-[#B69A7A] p-1.5 transition-colors"
          title="Open Public Storefront"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                active
                  ? 'bg-[#B69A7A] text-[#252525] font-semibold shadow-md'
                  : 'text-[#F5F0E8]/80 hover:text-[#F5F0E8] hover:bg-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#252525]' : 'text-[#B69A7A]'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Footer */}
      <div className="p-4 border-t border-[#B69A7A]/25 bg-black/20">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-[#B69A7A]/20 border border-[#B69A7A]/40 flex items-center justify-center text-[#B69A7A]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#F5F0E8] truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-[#B69A7A] uppercase tracking-wider">
              Super Admin
            </p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-[#F5F0E8]/75 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
