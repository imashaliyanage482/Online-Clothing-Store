import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const ATELIER_HERO_DESCRIPTION =
  'Thoughtfully curated essentials, designed for everyday confidence and lasting style.';

export default function EditorialHero({
  image,
  imageAlt,
  breadcrumbs = [],
  belowImageText,
  eyebrow,
  heading,
  description,
  imageClassName = 'object-cover object-top',
  imageAspectClassName = 'aspect-[16/9] sm:aspect-[1672/687]',
  imageContainerClassName = '',
  overlayClassName = 'w-[72%] sm:w-[56%] lg:w-[48%]',
  titleClassName = '',
  contentClassName = '',
  contentSide = 'left',
  showContent = true,
  unoptimized = false,
  children,
}) {
  if (!image) {
    return (
      <section className="relative overflow-hidden border-b border-[#B69A7A]/30 bg-[#F5F0E8] px-4 py-8 text-center sm:px-6 sm:py-10 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(182,154,122,0.12),_transparent_68%)]"
        />
        <div className="editorial-hero-copy relative mx-auto max-w-3xl">
          {eyebrow && (
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B69A7A] sm:text-[11px]">
              {eyebrow}
            </span>
          )}
          <h1 className={`font-serif text-2xl font-bold tracking-tight text-[#252525] sm:text-3xl lg:text-4xl ${titleClassName}`}>
            {heading}
          </h1>
          {description && (
            <p className="mx-auto mt-2 max-w-xl text-xs font-light leading-relaxed text-[#252525]/75 sm:text-sm">
              {description}
            </p>
          )}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden border-b border-[#B69A7A]/30 bg-[#EFE0CF]">
      <div className={`relative ${imageAspectClassName} w-full overflow-hidden bg-[#EFE0CF] ${imageContainerClassName}`}>
        <Image
          src={image}
          alt={imageAlt || heading}
          fill
          priority
          unoptimized={unoptimized}
          sizes="100vw"
          className={imageClassName}
        />
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="absolute left-3 top-3 z-20 rounded-full border border-white/25 bg-[#252525]/55 px-3 py-2 text-[10px] text-white shadow-sm backdrop-blur-sm sm:left-6 sm:top-5 sm:px-4 sm:text-xs"
          >
            <ol className="flex items-center gap-2">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={`${crumb.label}-${index}`}>
                    {index > 0 && (
                      <li aria-hidden="true" className="text-white/70">/</li>
                    )}
                    <li>
                      {isLast ? (
                        <span aria-current="page" className="font-semibold text-white">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href || '#'}
                          className="text-white/85 transition-colors hover:text-white"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
        )}
        {!belowImageText && showContent && (
          <div
            className={`absolute inset-y-0 ${
              contentSide === 'right' ? 'right-0 justify-end' : 'left-0'
            } flex items-center ${overlayClassName}`}
          >
            <div
              className={`absolute inset-0 ${
                contentSide === 'right'
                  ? 'bg-gradient-to-l from-[#F5E9DA]/95 via-[#F5E9DA]/80 to-transparent'
                  : 'bg-gradient-to-r from-[#F5E9DA]/95 via-[#F5E9DA]/80 to-transparent'
              }`}
            />
            <div
              className={`relative max-w-2xl px-4 py-4 sm:px-8 sm:py-8 lg:px-16 ${
                contentSide === 'right' ? 'text-right' : ''
              } ${contentClassName}`}
            >
              {eyebrow && (
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#B69A7A]">
                  {eyebrow}
                </span>
              )}
              <h1 className={`font-serif text-xl font-bold tracking-tight text-[#252525] sm:text-4xl lg:text-6xl ${titleClassName}`}>
                {heading}
              </h1>
              {description && (
                <p className="mt-3 max-w-md text-xs font-light leading-relaxed text-[#252525]/85 sm:text-base">
                  {description}
                </p>
              )}
              {children}
            </div>
          </div>
        )}
      </div>
      {belowImageText && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-[#B69A7A]/35 bg-[#F5F0E8]/80 py-2.5 backdrop-blur-sm sm:py-3">
          <span className="sr-only">{belowImageText}</span>
          <div aria-hidden="true" className="editorial-hero-marquee flex w-max">
            {[0, 1].map((group) => (
              <div key={group} className="flex shrink-0 items-center">
                {[0, 1, 2].map((item) => (
                  <React.Fragment key={item}>
                    <span className="px-5 font-serif text-sm font-bold tracking-tight text-[#252525] sm:px-8 sm:text-xl lg:text-2xl">
                      {belowImageText}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
