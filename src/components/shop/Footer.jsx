'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Instagram, Facebook, Youtube } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

function PinterestIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.911 2.171-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useCurrency();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="bg-[#252525] text-[#F5F0E8] pt-12 pb-8 sm:pt-16 sm:pb-12 border-t border-[#B69A7A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-10 sm:pb-14 border-b border-[#B69A7A]/25">

          {/* Column 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-2xl font-bold tracking-[0.12em] text-[#F5F0E8] uppercase leading-none">
                {settings.storeName}
              </span>
              <span className="text-[8.5px] tracking-[0.34em] text-[#B69A7A] font-medium uppercase mt-1">
                {settings.storeTagline}
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-[#F5F0E8]/75 max-w-sm pt-2">
              Modern luxury fashion built for modern living. Refined craftsmanship, natural textiles, and timeless silhouettes.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#B69A7A]/30 flex items-center justify-center text-[#F5F0E8] hover:text-[#252525] hover:bg-[#B69A7A] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#B69A7A]/30 flex items-center justify-center text-[#F5F0E8] hover:text-[#252525] hover:bg-[#B69A7A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#B69A7A]/30 flex items-center justify-center text-[#F5F0E8] hover:text-[#252525] hover:bg-[#B69A7A] transition-colors"
                aria-label="Pinterest"
              >
                <PinterestIcon className="w-3 h-3" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#B69A7A]/30 flex items-center justify-center text-[#F5F0E8] hover:text-[#252525] hover:bg-[#B69A7A] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[#F5F0E8] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F0E8]/75">
              <li>
                <Link href="/" className="hover:text-[#B69A7A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#B69A7A] transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/men" className="hover:text-[#B69A7A] transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#B69A7A] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-[#B69A7A] hover:text-[#F5F0E8] font-medium transition-colors">
                  SALE
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter (6 cols) */}
          <div className="lg:col-span-6">
            <h4 className="text-[#F5F0E8] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Private Newsletter
            </h4>
            <p className="text-xs text-[#F5F0E8]/75 leading-relaxed mb-4">
              Receive private editorial releases, seasonal previews, and invitations to exclusive atelier sales.
            </p>

            <form onSubmit={handleSubscribe} className="relative max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-[#1C1C1C] text-xs text-[#F5F0E8] placeholder-[#F5F0E8]/40 pl-4 pr-11 py-3 rounded-full border border-[#B69A7A]/40 focus:border-[#B69A7A] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#B69A7A] text-[#252525] flex items-center justify-center hover:bg-[#F5F0E8] transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="mt-2 text-xs text-[#B69A7A]">
                Thank you for subscribing to our atelier newsletter.
              </p>
            )}
          </div>
        </div>

        <section className="py-6 border-b border-[#B69A7A]/25">
          <h4 className="text-[#F5F0E8] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Concierge & Support
          </h4>
          <div className="flex flex-col gap-2 text-xs text-[#F5F0E8]/75 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {settings.supportEmail && (
              <a className="hover:text-[#B69A7A] transition-colors" href={`mailto:${settings.supportEmail}`}>
                {settings.supportEmail}
              </a>
            )}
            {settings.supportPhone && (
              <a className="hover:text-[#B69A7A] transition-colors" href={`tel:${settings.supportPhone.replace(/[^\d+]/g, '')}`}>
                {settings.supportPhone}
              </a>
            )}
            {settings.address && <span>{settings.address}</span>}
          </div>
        </section>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F5F0E8]/60 gap-4">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
