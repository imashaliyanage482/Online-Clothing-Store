'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 'slide-1',
    image: '/images/home-hero-slide-1.png',
    imageAlt: 'Discover Your New Style',
    eyebrow: 'NEW SEASON / 2026 EDIT',
    heading: 'Discover Your New Style',
    description:
      'Elevate your everyday wardrobe with timeless essentials and modern pieces designed for effortless elegance.',
    buttonText: 'SHOP NEW ARRIVALS',
    buttonHref: '/collections/new-arrivals',
    secondaryButtonText: 'Explore Collection',
    secondaryButtonHref: '/collections',
    alignment: 'left',
    imagePosition: 'object-cover object-[center_top]',
  },
  {
    id: 'slide-2',
    image: '/images/home-hero-slide-2.png',
    imageAlt: 'Style That Speaks for You',
    eyebrow: 'ATELIER LUXURY COLLECTION',
    heading: 'Style That Speaks for You',
    description:
      'Discover refined silhouettes, premium essentials, and timeless designs that make every moment a statement.',
    buttonText: 'EXPLORE COLLECTION',
    buttonHref: '/collections',
    secondaryButtonText: 'Shop Menswear',
    secondaryButtonHref: '/men',
    alignment: 'left',
    imagePosition: 'object-cover object-[center_top]',
  },
  {
    id: 'slide-3',
    image: '/images/home-hero-slide-3.png',
    imageAlt: 'Everyday Looks, Elevated',
    eyebrow: "WOMEN'S ATELIER COLLECTION",
    heading: 'Everyday Looks, Elevated',
    description:
      'From relaxed essentials to statement pieces, find styles that bring confidence and comfort to every day.',
    buttonText: 'DISCOVER YOUR STYLE',
    buttonHref: '/women',
    secondaryButtonText: 'View Dresses',
    secondaryButtonHref: '/women/dresses',
    alignment: 'left',
    imagePosition: 'object-cover object-[center_top]',
  },
];

export default function HomeHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  // Auto slide advance every 5 seconds (5000ms)
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  return (
    <section
      aria-label="Home Hero Showcase"
      className="relative w-full overflow-hidden border-b border-[#B69A7A]/30 bg-[#EFE0CF]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EFE0CF] sm:aspect-[1672/687]">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isLeft = slide.alignment === 'left';

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`${slide.imagePosition} select-none transition-transform duration-1000 ${
                  isActive ? 'scale-100' : 'scale-105'
                }`}
              />

              {/* Gradient Overlay tailored to Left or Right alignment */}
              <div
                className={`absolute inset-y-0 ${
                  isLeft
                    ? 'left-0 w-full sm:w-[62%] md:w-[56%] lg:w-[48%] bg-gradient-to-r from-[#F5E9DA]/95 via-[#F5E9DA]/85 to-transparent'
                    : 'right-0 w-full sm:w-[62%] md:w-[56%] lg:w-[50%] bg-gradient-to-l from-[#F5E9DA]/95 via-[#F5E9DA]/85 to-transparent'
                }`}
              />

              {/* Text & Content Container */}
              <div
                className={`absolute inset-y-0 flex items-center px-3 sm:px-6 lg:px-16 ${
                  isLeft
                    ? 'left-0 justify-start'
                    : 'right-0 justify-end'
                }`}
              >
                <div
                  className={`w-full max-w-[280px] py-1 sm:max-w-[300px] sm:py-8 md:max-w-xl md:py-16 lg:max-w-2xl ${
                    isActive ? 'animate-in fade-in slide-in-from-bottom-3 duration-700' : ''
                  }`}
                >
                  {slide.eyebrow && (
                    <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#B69A7A] sm:mb-2 sm:text-[10px] sm:tracking-[0.25em] md:mb-3 md:text-[11px] md:tracking-[0.3em]">
                      {slide.eyebrow}
                    </span>
                  )}

                  <h1 className="mb-1 font-serif text-xl font-bold leading-tight tracking-tight text-[#252525] min-[380px]:text-2xl sm:mb-3 sm:text-3xl md:mb-5 md:text-5xl md:leading-[1.08] lg:text-[64px]">
                    {slide.heading}
                  </h1>

                  <p className="max-w-md text-[10px] font-light leading-snug text-[#252525]/85 sm:text-xs sm:leading-relaxed md:text-base">
                    {slide.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-2 md:mt-9 md:gap-4">
                    <Link
                      href={slide.buttonHref}
                      className="group inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#252525] px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-[#F5F0E8] shadow-md transition-all hover:bg-[#B69A7A] hover:text-[#252525] sm:px-4 sm:py-2 sm:text-[10px] md:gap-3 md:px-8 md:py-4 md:text-sm"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                    </Link>

                    {slide.secondaryButtonText && (
                      <Link
                        href={slide.secondaryButtonHref}
                        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#B69A7A] bg-[#F5F0E8]/80 px-2.5 py-2 text-[9px] font-medium text-[#252525] backdrop-blur-sm transition-all hover:bg-[#B69A7A]/20 sm:px-4 sm:py-2 sm:text-[10px] md:px-6 md:py-4 md:text-sm"
                      >
                        <span>{slide.secondaryButtonText}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Next Slide Arrow Button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Hero Slide"
          className="absolute right-3.5 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#B69A7A]/40 bg-[#F5F0E8]/85 text-[#252525] shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-[#252525] hover:text-[#F5F0E8] hover:border-[#252525] cursor-pointer"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 rounded-full bg-[#252525]/20 px-3.5 py-1.5 backdrop-blur-md">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-[#252525]'
                  : 'w-2.5 bg-[#252525]/40 hover:bg-[#252525]/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
