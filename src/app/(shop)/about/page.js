import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Scissors,
  Leaf,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Truck,
} from 'lucide-react';

export const metadata = {
  title: 'Our Atelier & Philosophy | FashionStore',
  description:
    'Discover FashionStore — an artisanal fashion house founded on quiet luxury, ethical natural textiles, and bespoke tailoring in Colombo, Sri Lanka.',
};

export default function AboutPage() {
  const pillars = [
    {
      title: 'Ethical Natural Textiles',
      category: 'SUSTAINABILITY',
      icon: Leaf,
      description:
        'From traceable Australian Merino wool and mulberry silk to GOTS-certified organic cotton and airy European linen, every fiber is selected for tactile comfort, natural drape, and environmental responsibility.',
    },
    {
      title: 'Artisanal Tailoring',
      category: 'CRAFTSMANSHIP',
      icon: Scissors,
      description:
        'We partner with legacy ateliers who honor heritage garment construction. Reinforced seam linings, hand-finished hems, and real horn fixtures guarantee silhouettes that endure wear after wear.',
    },
    {
      title: 'Timeless Quiet Luxury',
      category: 'PHILOSOPHY',
      icon: Sparkles,
      description:
        'We deliberately reject fast-fashion turnover. Each capsule wardrobe piece is designed with clean architectural lines and refined neutrals that remain effortlessly relevant across seasons and years.',
    },
    {
      title: 'White-Glove Concierge',
      category: 'CLIENT CARE',
      icon: ShieldCheck,
      description:
        'Experience personalized styling advice, transparent delivery tracking across all 9 provinces of Sri Lanka, and dedicated concierge support for fittings, exchanges, and custom requests.',
    },
  ];

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      {/* ── 1. EDITORIAL HERO SECTION WITH MATCHING IMAGE ── */}
      <section className="relative overflow-hidden border-b border-[#B69A7A]/30 py-20 sm:py-28 lg:py-36 min-h-[520px] sm:min-h-[580px] flex items-center bg-[#252525]">
        {/* Background Editorial Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-editorial.jpg"
            alt="FashionStore Atelier Studio"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Refined Luxury Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#252525]/92 via-[#252525]/75 to-[#252525]/88" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-[#F5F0E8]">
          <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase bg-[#B69A7A]/30 text-[#F5F0E8] border border-[#B69A7A]/50 mb-4 backdrop-blur-sm">
            ATELIER HERITAGE & VISION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F0E8] max-w-4xl mx-auto leading-[1.12]">
            Clothing made with intention. Designed to outlive the moment.
          </h1>
          <p className="mt-6 text-sm sm:text-lg text-[#F5F0E8]/85 max-w-2xl mx-auto font-light leading-relaxed">
            FashionStore was founded on a singular conviction: luxury is not loud logos or fleeting trends. It is the sublime feel of authentic fabric, the quiet confidence of an impeccable cut, and the pride of wearing a story crafted to last.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/women"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#B69A7A] text-[#252525] rounded-full text-xs font-bold tracking-wider hover:bg-[#c9af90] transition-all shadow-md"
            >
              <span>Explore Women&apos;s Edit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/men"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white/15 hover:bg-white/25 border border-white/40 text-[#F5F0E8] rounded-full text-xs font-bold tracking-wider transition-all backdrop-blur-sm shadow-sm"
            >
              <span>Explore Men&apos;s Edit</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B69A7A]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. THE STORY / FOUNDING CONVICTION ── */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[10px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase block">
              OUR BEGINNINGS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#252525] leading-snug">
              From Colombo Atelier to Modern Wardrobe Staples
            </h2>
            <p className="text-xs sm:text-sm text-[#252525]/80 leading-relaxed font-light">
              Conceived in the heart of Colombo, Sri Lanka, FashionStore began as a quiet reaction against disposable garment cycles. We asked a fundamental question: why should wardrobe favorites lose their charm after a few washes?
            </p>
            <p className="text-xs sm:text-sm text-[#252525]/80 leading-relaxed font-light">
              By working hand-in-hand with master patternmakers and weavers, we engineered clothing that feels weightless yet structured. Each collection balances the warm tropical climate of the island with cosmopolitan silhouettes suitable for boardrooms, intimate evenings, and seaside getaways.
            </p>
            <div className="pt-2 flex items-center gap-6">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">100%</div>
                <div className="text-[10px] text-[#252525]/60 uppercase tracking-wider font-semibold mt-0.5">
                  Natural & Recycled Fibers
                </div>
              </div>
              <div className="h-10 w-[1px] bg-[#B69A7A]/40" />
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">9</div>
                <div className="text-[10px] text-[#252525]/60 uppercase tracking-wider font-semibold mt-0.5">
                  Provinces Islandwide Delivery
                </div>
              </div>
              <div className="h-10 w-[1px] bg-[#B69A7A]/40" />
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">14-Day</div>
                <div className="text-[10px] text-[#252525]/60 uppercase tracking-wider font-semibold mt-0.5">
                  Atelier Exchange Window
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#B69A7A]/30 space-y-6 shadow-sm">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#B69A7A] uppercase block">
              THE MANIFESTO
            </span>
            <blockquote className="font-serif text-xl sm:text-2xl italic text-[#252525] leading-relaxed">
              &ldquo;We do not produce garments for the landfill. We create timeless pieces that age gracefully alongside the individuals who wear them.&rdquo;
            </blockquote>
            <div className="pt-4 border-t border-[#B69A7A]/25 flex items-center justify-between text-xs text-[#252525]/70">
              <span className="font-semibold text-[#252525]">FashionStore Design Studio</span>
              <span>Colombo 07, Sri Lanka</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FOUR CORE PILLARS ── */}
      <section className="py-16 bg-[#FAF7F2] border-t border-b border-[#B69A7A]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#B69A7A] uppercase block mb-2">
              THE STANDARDS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#252525]">
              Built Upon Four Pillars of Excellence
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#252525]/70 font-light">
              Every garment carrying the FashionStore atelier hallmark satisfies strict material, labor, and aesthetic standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white p-7 sm:p-8 rounded-2xl border border-[#B69A7A]/30 shadow-sm transition-all hover:shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#B69A7A]">
                      {pillar.category}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#B69A7A]/30 flex items-center justify-center text-[#252525]">
                      <Icon className="w-5 h-5 text-[#B69A7A]" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252525]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#252525]/75 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. FLAGSHIP ATELIER & CONCIERGE INFORMATION ── */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#B69A7A]/35 bg-[#FAF7F2] p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase block">
                FLAGSHIP BOUTIQUE & CONCIERGE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252525]">
                Visit Us or Connect with Our Wardrobe Stylists
              </h2>
              <p className="text-xs sm:text-sm text-[#252525]/75 font-light leading-relaxed">
                Whether you need assistance selecting the ideal size, tailoring consultation, or tracking an existing dispatch, our concierge team is at your disposal.
              </p>

              <div className="space-y-3 pt-3 text-xs text-[#252525]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#B69A7A]/40 flex items-center justify-center text-[#B69A7A]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>
                    <strong>Flagship Address:</strong> Atelier Flagship, Colombo 07, Sri Lanka
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#B69A7A]/40 flex items-center justify-center text-[#B69A7A]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>
                    <strong>Phone Support:</strong> +94 11 234 5678 (Mon - Sat, 9:00 AM - 7:00 PM)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#B69A7A]/40 flex items-center justify-center text-[#B69A7A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>
                    <strong>Email Concierge:</strong> concierge@fashionstore.com
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#B69A7A]/40 flex items-center justify-center text-[#B69A7A]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>
                    <strong>Delivery Standard:</strong> Rs. 350 (Western Province) • Rs. 450 (Other Provinces) • Free above Rs. 15,000
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <Link
                href="/collections/best-sellers"
                className="w-full text-center px-6 py-3.5 rounded-2xl bg-[#252525] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3d3d3d] transition-all shadow-md"
              >
                Browse Best Sellers
              </Link>
              <Link
                href="/collections/seasonal-edit"
                className="w-full text-center px-6 py-3.5 rounded-2xl bg-white border border-[#B69A7A]/50 text-[#252525] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5F0E8] transition-all shadow-sm"
              >
                View Seasonal Edit
              </Link>
              <Link
                href="/contact"
                className="w-full text-center px-6 py-3.5 rounded-2xl bg-transparent border border-[#252525]/30 text-[#252525] text-xs font-semibold uppercase tracking-wider hover:border-[#252525] transition-all"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
