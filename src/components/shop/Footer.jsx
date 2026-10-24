import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Collections</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/categories/womens-collection" className="hover:text-white transition-colors">
                  Women's Wear
                </Link>
              </li>
              <li>
                <Link href="/categories/mens-collection" className="hover:text-white transition-colors">
                  Men's Wear
                </Link>
              </li>
              <li>
                <Link href="/categories/accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Customer Support</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Order Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About FashionStore
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Fashion.lk</h4>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              Modern apparel crafted with sustainable textiles, designed for longevity, comfort, and timeless elegance.
            </p>
            <div className="mt-6 text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Fashion.lk Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
