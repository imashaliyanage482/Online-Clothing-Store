import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | FashionStore',
  description: 'Review our terms of service, client agreements, and purchasing conditions.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-8">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase block mb-2">
            LEGAL ARCHIVE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
            Terms & Conditions
          </h1>
        </div>

        <div className="p-8 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 space-y-6 text-sm sm:text-base leading-relaxed text-[#252525]/80 font-light">
          <p>
            Welcome to FashionStore. By browsing this website and purchasing our garments, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h3 className="font-serif text-lg font-bold text-[#252525] pt-2">
            Product Availability & Pricing
          </h3>
          <p>
            All clothing collections, limited capsule releases, and prices are subject to change without prior notice. We reserve the right to discontinue any garment at our discretion.
          </p>
          <h3 className="font-serif text-lg font-bold text-[#252525] pt-2">
            Intellectual Property
          </h3>
          <p>
            All content, including imagery, photography, editorial layouts, and trademarked identifiers are the exclusive property of FashionStore.
          </p>
        </div>
      </div>
    </div>
  );
}
