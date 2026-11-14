'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CustomerSidebar from '@/components/customer/CustomerSidebar';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { Menu, X, User, ExternalLink } from 'lucide-react';

export default function CustomerAccountLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <CurrencyProvider>
      <div className="flex min-h-screen bg-[#F5F0E8] font-sans text-[#252525]">
        {/* Desktop Sidebar (Fixed Full-Height on Left Edge - matches Admin Panel) */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="fixed inset-y-0 left-0 w-64">
            <CustomerSidebar />
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
            <Link href="/account" className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#B69A7A]" />
              <span className="font-serif text-base font-bold tracking-wider text-[#F5F0E8]">
                CLIENT ATELIER
              </span>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-[#F5F0E8]/70 hover:text-[#F5F0E8] hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-65px)]">
            <CustomerSidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Mobile Top Header (only on small screens) */}
          <div className="lg:hidden h-14 bg-[#252525] text-[#F5F0E8] px-4 flex items-center justify-between border-b border-[#B69A7A]/30 sticky top-0 z-40">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-[#F5F0E8] hover:bg-white/10 rounded-lg cursor-pointer"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/account" className="font-serif text-sm font-bold tracking-widest uppercase">
              FASHIONSTORE CLIENT
            </Link>
            <Link
              href="/"
              target="_blank"
              className="p-1.5 text-[#B69A7A] hover:text-[#F5F0E8]"
              title="Open Public Storefront"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
            {children}
          </main>
        </div>
      </div>
    </CurrencyProvider>
  );
}
