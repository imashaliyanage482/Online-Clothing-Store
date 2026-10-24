'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, User as UserIcon, Search, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                Fashion<span className="text-amber-600">Store</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/products" className="hover:text-slate-900 transition-colors">
                All Apparel
              </Link>
              <Link href="/categories/womens-collection" className="hover:text-slate-900 transition-colors">
                Women
              </Link>
              <Link href="/categories/mens-collection" className="hover:text-slate-900 transition-colors">
                Men
              </Link>
              <Link href="/categories/accessories" className="hover:text-slate-900 transition-colors">
                Accessories
              </Link>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Shopping Cart Icon with Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-amber-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Admin Badge */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full hover:bg-amber-100"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1.5 text-slate-700 hover:text-slate-900 font-medium text-sm rounded-lg hover:bg-slate-100"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-semibold">{user.name || 'Account'}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-slate-900"
          >
            All Apparel
          </Link>
          <Link
            href="/categories/womens-collection"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-slate-900"
          >
            Women's Collection
          </Link>
          <Link
            href="/categories/mens-collection"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-slate-900"
          >
            Men's Collection
          </Link>
          <Link
            href="/categories/accessories"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-slate-900"
          >
            Accessories
          </Link>
          {user && (
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block pt-2 border-t border-slate-100 text-base font-semibold text-slate-900"
            >
              My Account
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
