'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { womenCategoriesList } from '@/data/womenProducts';
import { useCurrency } from '@/context/CurrencyContext';
import EditorialHero from '@/components/shop/EditorialHero';

export default function WomenPage() {
  const { settings, formatPrice } = useCurrency();
  const [categories, setCategories] = React.useState(womenCategoriesList);

  React.useEffect(() => {
    fetch('/api/categories?gender=women')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories?.length) {
          const list = womenCategoriesList.map((base) => {
            const match = data.categories.find(
              (c) => c.slug === base.slug || c.id === base.id
            );
            return match ? { ...base, ...match } : base;
          });
          data.categories.forEach((c) => {
            if (
              (c.gender === 'women' || c.gender === 'unisex') &&
              !list.some((item) => item.slug === c.slug)
            ) {
              list.push({
                ...c,
                href: c.href || `/women/${c.slug}`,
                itemCount: c.itemCount || 'Collection',
              });
            }
          });
          setCategories(list);
        }
      })
      .catch((err) => console.error('Failed fetching women categories:', err));
  }, []);

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <EditorialHero
        image="/images/women-main-hero.png"
        imageAlt="Women's Atelier Collection"
        imageClassName="object-contain object-center"
        belowImageText="Made to Be Remembered, Styled to Be You."
      />

      {/* ── 2. Category Cards Grid (Exact Women Dropdown Categories) ── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* 3-column desktop, 2-column tablet, 1-column mobile grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="group flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#B69A7A]/30 hover:border-[#B69A7A] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              {/* Category Image with Zoom on Hover */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-[#EBE3D5] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#252525]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Floating Arrow Pill */}
                <div className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-[#252525] text-[#F5F0E8] flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Category Card Content */}
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#252525] group-hover:text-[#B69A7A] transition-colors">
                    {category.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#252525]/75 mt-1 font-light leading-relaxed flex-1">
                  {category.description}
                </p>

                {/* CTA Link Button */}
                <div className="mt-6 pt-4 border-t border-[#B69A7A]/25 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#252525] uppercase tracking-wider group-hover:text-[#B69A7A] transition-colors flex items-center gap-1.5">
                    {category.cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] text-[#B69A7A] font-medium">
                    View Catalogue →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Atelier Quality Assurance Bar ── */}
      <section className="py-14 border-t border-[#B69A7A]/30 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-[#F5F0E8] border border-[#B69A7A]/40 flex items-center justify-center text-[#252525] shrink-0">
                <Truck className="w-5 h-5 stroke-[1.6]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#252525]">Complimentary Islandwide Delivery</h4>
                <p className="text-xs text-[#252525]/70 mt-0.5">
                  {Number(settings.freeShippingThreshold) === 0
                    ? 'On all orders'
                    : `On orders of ${formatPrice(settings.freeShippingThreshold)} or more`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-[#F5F0E8] border border-[#B69A7A]/40 flex items-center justify-center text-[#252525] shrink-0">
                <RotateCcw className="w-5 h-5 stroke-[1.6]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#252525]">30-Day Bespoke Exchanges</h4>
                <p className="text-xs text-[#252525]/70 mt-0.5">Easy returns and doorstep exchanges</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-[#F5F0E8] border border-[#B69A7A]/40 flex items-center justify-center text-[#252525] shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[1.6]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#252525]">Premium Certified Fabrics</h4>
                <p className="text-xs text-[#252525]/70 mt-0.5">100% natural linen, silk, and wool</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
