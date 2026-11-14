'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu, X, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Do not render admin chrome on login screen
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0E8] font-sans text-[#252525]">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile Slide-Over Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Slide-Over Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#252525] text-[#F5F0E8] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#B69A7A]/30">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#B69A7A]" />
            <span className="font-serif text-base font-bold tracking-wider text-[#F5F0E8]">
              ADMIN PANEL
            </span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-[#F5F0E8]/70 hover:text-[#F5F0E8] hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-65px)]">
          <AdminSidebar onNavigate={() => setMobileSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Top App Bar */}
        <div className="lg:hidden h-14 bg-[#252525] text-[#F5F0E8] px-4 flex items-center justify-between border-b border-[#B69A7A]/30 sticky top-0 z-40">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 -ml-2 text-[#F5F0E8] hover:bg-white/10 rounded-lg cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/admin/dashboard" className="font-serif text-sm font-bold tracking-widest uppercase">
            FASHIONSTORE ADMIN
          </Link>
          <Link
            href="/"
            target="_blank"
            className="p-1.5 text-[#B69A7A] hover:text-[#F5F0E8]"
            title="View Public Store"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
