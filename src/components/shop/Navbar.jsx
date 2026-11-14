'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { womenCategoriesList } from '@/data/womenProducts';
import { defaultMenCategories } from '@/data/catalogDefaults';
import {
  Search, User as UserIcon, ShoppingBag, Menu, X, ChevronDown,
} from 'lucide-react';

/* ─────────────────── DROPDOWN CATEGORY DATA ─────────────────── */

const initialWomenCategories = womenCategoriesList.map(({ title, href }) => ({ title, href }));
const initialMenCategories = defaultMenCategories.map(({ title, href }) => ({ title, href }));
const initialCollections = [
  { title: 'New Season', href: '/collections/new-season' },
  { title: 'Office Wear', href: '/collections/office-wear' },
  { title: 'Evening & Occasion Wear', href: '/collections/evening-occasion-wear' },
  { title: 'Seasonal Edit', href: '/collections/seasonal-edit' },
  { title: 'Couples Wear', href: '/collections/couples-wear' },
];

function VerticalDropdown({ isOpen, items, onClose, onCancelClose, onScheduleClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 pt-2 z-50 min-w-[240px]"
      onMouseEnter={onCancelClose}
      onMouseLeave={onScheduleClose}
    >
      <div className="bg-[#F5F0E8] border border-[#B69A7A]/40 rounded-xl shadow-[0_16px_36px_rgba(37,37,37,0.14)] p-1.5 flex flex-col space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="px-3.5 py-2 text-[13px] font-medium text-[#252525]/90 hover:text-[#252525] hover:bg-[#B69A7A]/20 rounded-lg transition-colors duration-150 block text-left"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── NAVBAR ─────────────────── */

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { settings, currencyCode, enabledCurrencies, changeCurrency } = useCurrency();

  const [womenCategories, setWomenCategories] = useState(initialWomenCategories);
  const [menCategories, setMenCategories] = useState(initialMenCategories);
  const [collectionsData, setCollectionsData] = useState(initialCollections);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});

  const navRef = useRef(null);
  const searchRef = useRef(null);
  const menuTimeoutRef = useRef(null);
  const menuOpenedByHoverRef = useRef(null);

  // Dynamically load updated categories and collections from API
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.categories?.length) {
          const wCats = data.categories
            .filter((c) => (c.gender === 'women' || c.gender === 'unisex') && c.isActive !== false)
            .map((c) => ({ title: c.title, href: c.href || `/women/${c.slug}` }));
          const mCats = data.categories
            .filter((c) => (c.gender === 'men' || c.gender === 'unisex') && c.isActive !== false)
            .map((c) => ({ title: c.title, href: c.href || `/men/${c.slug}` }));
          if (wCats.length) setWomenCategories(wCats);
          if (mCats.length) setMenCategories(mCats);
        }
      })
      .catch((error) => console.error('Failed fetching navigation categories:', error));

    fetch('/api/collections?active=true')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load collections.');
        }
        return data;
      })
      .then((data) => {
        if (data.collections) {
          const cols = data.collections
            .filter((c) => c.isActive !== false)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((c) => ({ title: c.title, href: `/collections/${c.slug}` }));
          setCollectionsData(cols);
        }
      })
      .catch((error) => console.error('Failed fetching navigation collections:', error));
  }, []);

  // Close mega-menu on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        menuOpenedByHoverRef.current = null;
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
        menuOpenedByHoverRef.current = null;
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const openMenu = (key) => {
    clearTimeout(menuTimeoutRef.current);
    menuOpenedByHoverRef.current = key;
    setActiveMenu(key);
  };

  const toggleMenu = (key) => {
    clearTimeout(menuTimeoutRef.current);
    if (menuOpenedByHoverRef.current === key) {
      menuOpenedByHoverRef.current = null;
      setActiveMenu(key);
      return;
    }
    menuOpenedByHoverRef.current = null;
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const scheduleClose = () => {
    clearTimeout(menuTimeoutRef.current);
    menuTimeoutRef.current = setTimeout(() => {
      menuOpenedByHoverRef.current = null;
      setActiveMenu(null);
    }, 320);
  };

  const cancelClose = () => clearTimeout(menuTimeoutRef.current);

  const closeMenu = useCallback(() => {
    clearTimeout(menuTimeoutRef.current);
    menuOpenedByHoverRef.current = null;
    // Slight defer so Next.js Link click transition handles without being unmounted
    setTimeout(() => {
      setActiveMenu(null);
    }, 60);
  }, []);

  const toggleMobileSection = (key) => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header ref={navRef} className="w-full sticky top-0 z-50 bg-[#F5F0E8] border-b border-[#B69A7A]/30">
      {/* ── Top Announcement Bar ── */}
      <div className="bg-[#252525] text-[#F5F0E8] text-[11px] py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col items-center gap-1 text-center text-[9px] font-medium uppercase leading-tight tracking-wide sm:flex-1 sm:flex-row sm:justify-center sm:gap-0 sm:text-[10.5px] sm:tracking-widest">
            <span>Thoughtfully Curated Fashion for Every Story</span>
            <span className="hidden sm:inline sm:mx-2.5 text-[#B69A7A]">|</span>
            <span>14-Day Atelier Exchanges</span>
          </div>
          <div className="flex items-center gap-2">
            {enabledCurrencies.length > 1 ? (
              <div className="inline-flex items-center bg-white/15 hover:bg-white/25 border border-white/40 rounded-lg px-2.5 py-0.5 transition-colors shadow-sm">
                <span className="text-[9px] text-white/70 uppercase mr-1.5 font-medium hidden xs:inline">Currency:</span>
                <select
                  aria-label="Choose display currency"
                  value={currencyCode}
                  onChange={(event) => changeCurrency(event.target.value)}
                  className="bg-transparent text-white font-bold text-[10px] sm:text-[11px] focus:outline-none cursor-pointer tracking-wider"
                >
                  {enabledCurrencies.map((code) => (
                    <option key={code} value={code} className="bg-[#252525] text-white">
                      {code === 'LKR' ? 'Rs. LKR' : '$ USD'}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="bg-white/15 border border-white/40 text-white font-bold px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px]">
                {currencyCode === 'USD' ? '$ USD' : 'Rs. LKR'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar (Full Width - Brand Name at Far-Left Corner) ── */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-[72px] sm:gap-6">

          {/* Extreme Left: Brand Logo & Name (positioned at the very corner) */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-[17px] min-[380px]:text-[22px] sm:text-[25px] font-bold tracking-[0.06em] min-[380px]:tracking-[0.08em] sm:tracking-[0.12em] text-[#252525] uppercase leading-none group-hover:text-[#252525]/90 transition-colors">
                {settings.storeName}
              </span>
              <span className="text-[7px] sm:text-[8.5px] tracking-[0.25em] sm:tracking-[0.34em] text-[#B69A7A] font-semibold uppercase mt-1">
                {settings.storeTagline}
              </span>
            </Link>
          </div>

          {/* Navigation Order: Home | Women | Men | New Arrivals | Collections | SALE */}
          <nav className="hidden lg:flex items-center gap-1.5 lg:gap-2 text-[13px] font-medium text-[#252525]">

            {/* Home */}
            <Link
              href="/"
              className={`relative px-3 py-1.5 rounded-full transition-colors hover:bg-[#B69A7A]/15 ${
                isActive('/') && pathname === '/' ? 'font-semibold text-[#252525]' : 'text-[#252525]/85'
              }`}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#252525] rounded-full" />
              )}
            </Link>

            {/* Women */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('women')}
              onMouseLeave={scheduleClose}
            >
              <div
                className={`flex items-center rounded-full transition-colors ${
                  isActive('/women') || activeMenu === 'women'
                    ? 'bg-[#B69A7A]/20 font-semibold text-[#252525]'
                    : 'text-[#252525]/85 hover:bg-[#B69A7A]/15'
                }`}
              >
                <Link
                  href="/women"
                  className="py-1.5 pl-3.5 pr-1 text-inherit"
                  aria-label="Women Collection"
                >
                  Women
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMenu('women')}
                  className="cursor-pointer rounded-full py-1.5 pl-1 pr-3.5"
                  aria-label="Toggle Women categories"
                  aria-expanded={activeMenu === 'women'}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      activeMenu === 'women' ? 'rotate-180 text-[#252525]' : 'opacity-60'
                    }`}
                  />
                </button>
              </div>

              <VerticalDropdown
                isOpen={activeMenu === 'women'}
                items={womenCategories}
                onClose={closeMenu}
                onCancelClose={cancelClose}
                onScheduleClose={scheduleClose}
              />
            </div>

            {/* Men */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('men')}
              onMouseLeave={scheduleClose}
            >
              <div
                className={`flex items-center rounded-full transition-colors ${
                  isActive('/men') || activeMenu === 'men'
                    ? 'bg-[#B69A7A]/20 font-semibold text-[#252525]'
                    : 'text-[#252525]/85 hover:bg-[#B69A7A]/15'
                }`}
              >
                <Link
                  href="/men"
                  className="py-1.5 pl-3.5 pr-1 text-inherit"
                  aria-label="Men Collection"
                >
                  Men
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMenu('men')}
                  className="cursor-pointer rounded-full py-1.5 pl-1 pr-3.5"
                  aria-label="Toggle Men categories"
                  aria-expanded={activeMenu === 'men'}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      activeMenu === 'men' ? 'rotate-180 text-[#252525]' : 'opacity-60'
                    }`}
                  />
                </button>
              </div>

              <VerticalDropdown
                isOpen={activeMenu === 'men'}
                items={menCategories}
                onClose={closeMenu}
                onCancelClose={cancelClose}
                onScheduleClose={scheduleClose}
              />
            </div>

            {/* New Arrivals */}
            <Link
              href="/collections/new-arrivals"
              className={`relative px-3 py-1.5 rounded-full transition-colors hover:bg-[#B69A7A]/15 ${
                pathname === '/collections/new-arrivals' ? 'font-semibold text-[#252525]' : 'text-[#252525]/85'
              }`}
            >
              New Arrivals
              {pathname === '/collections/new-arrivals' && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#252525] rounded-full" />
              )}
            </Link>

            {/* Collections */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('collections')}
              onMouseLeave={scheduleClose}
            >
              <div
                className={`flex items-center rounded-full transition-colors ${
                  isActive('/collections') || activeMenu === 'collections'
                    ? 'bg-[#B69A7A]/20 font-semibold text-[#252525]'
                    : 'text-[#252525]/85 hover:bg-[#B69A7A]/15'
                }`}
              >
                <Link
                  href="/collections"
                  className="py-1.5 pl-3.5 pr-1 text-inherit"
                  aria-label="Collections"
                >
                  Collections
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMenu('collections')}
                  className="cursor-pointer rounded-full py-1.5 pl-1 pr-3.5"
                  aria-label="Toggle Collections categories"
                  aria-expanded={activeMenu === 'collections'}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      activeMenu === 'collections' ? 'rotate-180 text-[#252525]' : 'opacity-60'
                    }`}
                  />
                </button>
              </div>

              <VerticalDropdown
                isOpen={activeMenu === 'collections'}
                items={collectionsData}
                onClose={closeMenu}
                onCancelClose={cancelClose}
                onScheduleClose={scheduleClose}
              />
            </div>

            {/* SALE */}
            <Link
              href="/sale"
              className={`relative px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider transition-all ${
                isActive('/sale')
                  ? 'bg-[#252525] text-[#F5F0E8]'
                  : 'text-[#252525] border border-[#B69A7A] hover:bg-[#252525] hover:text-[#F5F0E8]'
              }`}
            >
              SALE
            </Link>
          </nav>

          {/* Right Side Icons: Search, Account, Shopping Bag (Clean minimal style preserved) */}
          <div className="flex items-center gap-0 sm:gap-2">

            {/* Search Desktop Toggle */}
            <div className="relative hidden lg:block" ref={searchRef}>
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center relative w-56 xl:w-64">
                  <Search className="w-4 h-4 text-[#B69A7A] absolute left-3.5 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setSearchOpen(false)}
                    placeholder="Search luxury styles…"
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] text-[#252525] placeholder-[#252525]/50 rounded-full border border-[#B69A7A]/50 focus:border-[#252525] focus:outline-none transition-all"
                  />
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 text-[#252525] hover:text-[#B69A7A] transition-colors rounded-full hover:bg-[#B69A7A]/10 cursor-pointer"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5 stroke-[1.6]" />
                </button>
              )}
            </div>

            {/* Mobile Search Link */}
            <Link
              href="/search"
              className="lg:hidden p-1.5 sm:p-2 text-[#252525] hover:text-[#B69A7A] transition-colors rounded-full"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </Link>

            {/* Account Icon */}
            {user ? (
              <Link
                href={user.role === 'ADMIN' ? '/admin/dashboard' : '/account'}
                className="hidden sm:flex p-2.5 text-[#252525] hover:text-[#B69A7A] transition-colors rounded-full hover:bg-[#B69A7A]/10"
                aria-label={user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Account'}
                title={user.role === 'ADMIN' ? 'Admin Dashboard' : user.name || 'My Account'}
              >
                <UserIcon className="w-5 h-5 stroke-[1.6]" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex p-2.5 text-[#252525] hover:text-[#B69A7A] transition-colors rounded-full hover:bg-[#B69A7A]/10"
                aria-label="Sign In"
                title="Sign In"
              >
                <UserIcon className="w-5 h-5 stroke-[1.6]" />
              </Link>
            )}

            {/* Shopping Bag Icon */}
            <Link
              href="/cart"
              className="relative p-1.5 sm:p-2.5 text-[#252525] hover:text-[#B69A7A] transition-colors rounded-full hover:bg-[#B69A7A]/10"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1 min-w-[17px] h-[17px] px-1 flex items-center justify-center text-[10px] font-bold text-[#F5F0E8] bg-[#252525] rounded-full leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-[#252525] hover:text-[#B69A7A] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F5F0E8] border-t border-[#B69A7A]/30 overflow-y-auto max-h-[85vh]">
          {/* Mobile Search Input */}
          <div className="px-5 pt-4 pb-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-[#B69A7A] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FAF7F2] text-[#252525] placeholder-[#252525]/50 rounded-full border border-[#B69A7A]/50 focus:border-[#252525] focus:outline-none"
              />
            </form>
          </div>

          <nav className="px-4 py-2 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium text-[#252525] hover:bg-[#B69A7A]/15 transition-colors"
            >
              Home
            </Link>

            {/* Women */}
            <div>
              <div className="w-full flex items-center justify-between px-3.5 py-1 text-sm font-medium text-[#252525] hover:bg-[#B69A7A]/15 rounded-lg transition-colors">
                <Link
                  href="/women"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-sm font-medium text-[#252525]"
                >
                  Women
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('women')}
                  className="p-2 cursor-pointer"
                  aria-label="Toggle Women dropdown"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded.women ? 'rotate-180 text-[#B69A7A]' : 'opacity-60'}`} />
                </button>
              </div>
              {mobileExpanded.women && (
                <div className="flex flex-col pl-4 pr-3 py-1 space-y-0.5 border-l-2 border-[#B69A7A]/50 ml-4 my-1">
                  {womenCategories.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-3 text-[13px] font-medium text-[#252525]/85 hover:text-[#252525] hover:bg-[#B69A7A]/15 rounded-md transition-colors block"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Men */}
            <div>
              <div className="w-full flex items-center justify-between px-3.5 py-1 text-sm font-medium text-[#252525] hover:bg-[#B69A7A]/15 rounded-lg transition-colors">
                <Link
                  href="/men"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-sm font-medium text-[#252525]"
                >
                  Men
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('men')}
                  className="p-2 cursor-pointer"
                  aria-label="Toggle Men dropdown"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded.men ? 'rotate-180 text-[#B69A7A]' : 'opacity-60'}`} />
                </button>
              </div>
              {mobileExpanded.men && (
                <div className="flex flex-col pl-4 pr-3 py-1 space-y-0.5 border-l-2 border-[#B69A7A]/50 ml-4 my-1">
                  {menCategories.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-3 text-[13px] font-medium text-[#252525]/85 hover:text-[#252525] hover:bg-[#B69A7A]/15 rounded-md transition-colors block"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* New Arrivals */}
            <Link
              href="/collections/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium text-[#252525] hover:bg-[#B69A7A]/15 transition-colors"
            >
              New Arrivals
            </Link>

            {/* Collections */}
            <div>
              <div className="w-full flex items-center justify-between px-3.5 py-1 text-sm font-medium text-[#252525] hover:bg-[#B69A7A]/15 rounded-lg transition-colors">
                <Link
                  href="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-sm font-medium text-[#252525]"
                >
                  Collections
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('collections')}
                  className="p-2 cursor-pointer"
                  aria-label="Toggle Collections dropdown"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded.collections ? 'rotate-180 text-[#B69A7A]' : 'opacity-60'}`} />
                </button>
              </div>
              {mobileExpanded.collections && (
                <div className="flex flex-col pl-4 pr-3 py-1 space-y-0.5 border-l-2 border-[#B69A7A]/50 ml-4 my-1">
                  {collectionsData.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-3 text-[13px] font-medium text-[#252525]/85 hover:text-[#252525] hover:bg-[#B69A7A]/15 rounded-md transition-colors block"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SALE */}
            <Link
              href="/sale"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold text-[#252525] bg-[#B69A7A]/20 hover:bg-[#B69A7A]/30 transition-colors"
            >
              SALE — Seasonal Markdowns
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-3 rounded-lg text-sm font-medium text-[#252525] hover:bg-[#B69A7A]/15 transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Footer */}
          <div className="px-5 py-4 border-t border-[#B69A7A]/30 flex items-center justify-between text-xs text-[#252525]/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#252525]">Currency:</span>
              <select
                aria-label="Choose mobile display currency"
                value={currencyCode}
                onChange={(event) => changeCurrency(event.target.value)}
                className="bg-[#252525] text-white font-bold px-2 py-1 rounded-lg text-xs outline-none cursor-pointer"
              >
                {enabledCurrencies.map((code) => (
                  <option key={code} value={code} className="bg-[#252525] text-white">
                    {code === 'LKR' ? 'Rs. LKR' : '$ USD'}
                  </option>
                ))}
              </select>
            </div>
            {user ? (
              <Link
                href={user.role === 'ADMIN' ? '/admin/dashboard' : '/account'}
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-[#252525] hover:text-[#B69A7A]"
              >
                {user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Account'}
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-[#252525] hover:text-[#B69A7A]">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
