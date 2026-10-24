'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  BarChart3,
  Shirt,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  TicketPercent,
  CreditCard,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Sales Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Products', href: '/admin/products', icon: Shirt },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Coupons & Promo', href: '/admin/coupons', icon: TicketPercent },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
    { name: 'Admin Profile', href: '/admin/profile', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-screen flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <Link href="/admin" className="text-base font-bold text-white tracking-wider uppercase">
          Fashion<span className="text-amber-500">Admin</span>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="text-slate-400 hover:text-white p-1"
          title="View Live Store"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-rose-400 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
