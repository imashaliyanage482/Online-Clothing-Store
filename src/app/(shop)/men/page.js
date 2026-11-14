'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { defaultMenCategories } from '@/data/catalogDefaults';
import { useCurrency } from '@/context/CurrencyContext';
import EditorialHero from '@/components/shop/EditorialHero';

export default function MenPage() {
  const { settings, formatPrice } = useCurrency();
  const [categories, setCategories] = React.useState(defaultMenCategories);

  React.useEffect(() => {
    fetch('/api/categories?gender=men')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories?.length) {
          const list = defaultMenCategories.map((base) => {
            const match = data.categories.find(
              (c) => c.slug === base.slug || c.id === base.id
            );
            return match ? { ...base, ...match } : base;
          });
          data.categories.forEach((c) => {
            if (
              (c.gender === 'men' || c.gender === 'unisex') &&
              !list.some((item) => item.slug === c.slug)
            ) {
              list.push({
                ...c,
                href: c.href || `/men/${c.slug}`,
                itemCount: c.itemCount || 'Collection',
              });
            }
          });
          setCategories(list);
        }
      })
      .catch((err) => console.error('Failed fetching men categories:', err));
  }, []);

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <EditorialHero
        image="/images/men-hero-lookbook.png"
        imageAlt="Men's Atelier Collection"
        imageClassName="object-cover object-top"
        belowImageText="Quiet Confidence Unmistakable Style"
      />

      {/* ── 2. Category Cards Grid (3 col desktop, 2 col tablet, 1 col mobile) ── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="group flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#B69A7A]/30 hover:border-[#B69A7A] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-[#EBE3D5] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#252525]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-[#252525] text-[#F5F0E8] flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#252525] group-hover:text-[#B69A7A] transition-colors">
                    {category.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-[13px] text-[#252525]/75 font-light leading-relaxed mb-6 flex-1">
                  {category.description}
                </p>

                <div className="pt-4 border-t border-[#B69A7A]/20 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#252525] group-hover:text-[#B69A7A] transition-colors">
                    {category.cta}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#B69A7A] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Atelier Quality Assurance Bar ── */}
      <section className="border-t border-[#B69A7A]/30 bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B69A7A]/20 text-[#252525] flex items-center justify-center shrink-0 border border-[#B69A7A]/40">
              <ShieldCheck className="w-6 h-6 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#252525]">
                Ethical Sourcing & Quality
              </h4>
              <p className="text-xs text-[#252525]/70 mt-1 font-light">
                Selvedge denim, European flax linen, and natural dyes tailored for durability.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B69A7A]/20 text-[#252525] flex items-center justify-center shrink-0 border border-[#B69A7A]/40">
              <Truck className="w-6 h-6 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#252525]">
                Complimentary Islandwide Dispatch
              </h4>
              <p className="text-xs text-[#252525]/70 mt-1 font-light">
                {Number(settings.freeShippingThreshold) === 0
                  ? 'Complimentary courier delivery across Sri Lanka on all orders.'
                  : `Express courier delivery across Sri Lanka on orders of ${formatPrice(settings.freeShippingThreshold)} or more.`}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B69A7A]/20 text-[#252525] flex items-center justify-center shrink-0 border border-[#B69A7A]/40">
              <RotateCcw className="w-6 h-6 stroke-[1.6]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#252525]">
                Bespoke Fit Exchanges
              </h4>
              <p className="text-xs text-[#252525]/70 mt-1 font-light">
                Hassle-free 14-day sizing exchange guarantee on all unworn tailored pieces.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
