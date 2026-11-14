import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Reusable landing page that shows image-based category/collection cards.
 * Color theme: Cream (#F5F0E8), Black (#252525), Beige (#B69A7A)
 */
export default function CategoryGridPage({
  heading,
  subheading,
  description,
  heroImage,
  items,
  columns = 3,
}) {
  const colClass =
    columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      {/* Editorial Hero Header */}
      {heroImage ? (
        <section className="w-full bg-[#252525] border-b border-[#B69A7A]/30">
          <div className="relative w-full aspect-[16/9] sm:aspect-[1672/687] overflow-hidden bg-[#EBE3D5]">
            <Image
              src={heroImage}
              alt={heading}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#252525] via-[#252525]/30 to-transparent" />
          </div>
          <div className="bg-[#252525] text-[#F5F0E8]">
            <div className="max-w-7xl mx-auto flex flex-col gap-5 px-5 py-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:justify-between lg:px-12">
              <div className="max-w-2xl">
                {subheading && (
                  <p className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase mb-2">
                    {subheading} / THE EDIT
                  </p>
                )}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-[#F5F0E8]">
                  {heading}
                </h1>
                {description && (
                  <p className="text-sm sm:text-base text-[#F5F0E8]/80 mt-2 max-w-xl leading-relaxed font-light">
                    {description}
                  </p>
                )}
              </div>
              <Link
                href="#category-grid"
                className="self-start md:self-center inline-flex items-center gap-3 border border-[#B69A7A] text-[#F5F0E8] text-xs font-semibold tracking-wide px-6 py-3 rounded-full hover:bg-[#B69A7A] hover:text-[#252525] transition-all"
              >
                <span>Explore the Edit</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#F5F0E8] border-b border-[#B69A7A]/30 py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {subheading && (
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase mb-2">
                {subheading}
              </p>
            )}
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#252525] tracking-tight mb-3">
              {heading}
            </h1>
            {description && (
              <p className="text-sm sm:text-base text-[#252525]/80 max-w-xl leading-relaxed font-light">
                {description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Category / Collection Cards */}
      <section id="category-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className={`grid ${colClass} gap-6 sm:gap-8`}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#B69A7A]/30 hover:-translate-y-1 hover:border-[#B69A7A] hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="block relative overflow-hidden bg-[#EBE3D5]" style={{ paddingBottom: '70%' }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#252525] leading-snug">
                  {item.title}
                </h2>
                {item.subtitle && (
                  <p className="text-xs sm:text-sm text-[#252525]/75 mt-1.5 leading-relaxed font-light">
                    {item.subtitle}
                  </p>
                )}
                <div className="mt-5 pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5F0E8] bg-[#252525] rounded-full px-5 py-2.5 group-hover:bg-[#B69A7A] group-hover:text-[#252525] transition-all">
                    <span>{item.cta || 'Explore'}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
