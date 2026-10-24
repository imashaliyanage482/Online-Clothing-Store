'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, User as UserIcon, Search, Menu, X, ShieldCheck, Heart } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-light tracking-[0.28em] text-slate-950 uppercase select-none transition-opacity group-hover:opacity-80">
                F A S H I O N<span className="font-normal lowercase tracking-normal text-xl text-amber-600">.lk</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-slate-700">
              <Link
                href="/categories/womens-collection"
                className="hover:text-amber-600 transition-colors py-1"
              >
                Women
              </Link>
              <Link
                href="/categories/mens-collection"
                className="hover:text-amber-600 transition-colors py-1"
              >
                Men
              </Link>
              <Link
                href="/categories/accessories"
                className="hover:text-amber-600 transition-colors py-1"
              >
                Accessories
              </Link>
              <Link
                href="/about"
                className="hover:text-amber-600 transition-colors py-1"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="hover:text-amber-600 transition-colors py-1"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Link
              href="/search"
              className="p-2 text-slate-800 hover:text-amber-600 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </Link>

            {/* Account */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full hover:bg-amber-100"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="p-2 text-slate-800 hover:text-amber-600 transition-colors"
                  aria-label="My Account"
                  title={user.name || 'Account'}
                >
                  <UserIcon className="w-5 h-5 stroke-[1.75]" />
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-slate-800 hover:text-amber-600 transition-colors"
                aria-label="Sign In"
                title="Sign In"
              >
                <UserIcon className="w-5 h-5 stroke-[1.75]" />
              </Link>
            )}

            {/* Wishlist Icon with Notification Pill */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-slate-800 hover:text-amber-600 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute top-1.5 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full leading-none">
                0
              </span>
            </Link>

            {/* Shopping Cart Icon with Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-slate-800 hover:text-amber-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute top-1.5 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full leading-none">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-800 hover:text-amber-600"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 pt-4 pb-6 space-y-3.5">
          <Link
            href="/categories/womens-collection"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold uppercase tracking-wider text-slate-800 hover:text-amber-600"
          >
            Women
          </Link>
          <Link
            href="/categories/mens-collection"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold uppercase tracking-wider text-slate-800 hover:text-amber-600"
          >
            Men
          </Link>
          <Link
            href="/categories/accessories"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold uppercase tracking-wider text-slate-800 hover:text-amber-600"
          >
            Accessories
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold uppercase tracking-wider text-slate-800 hover:text-amber-600"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold uppercase tracking-wider text-slate-800 hover:text-amber-600"
          >
            Contact Us
          </Link>
          {user ? (
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block pt-3 border-t border-slate-100 text-sm font-bold uppercase tracking-wider text-slate-900"
            >
              My Account ({user.name})
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block pt-3 border-t border-slate-100 text-sm font-bold uppercase tracking-wider text-amber-600"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
