import React from 'react';

export const metadata = {
  title: 'Shipping & Returns Policy | FashionStore',
  description: 'Learn about our complimentary shipping criteria, delivery estimates, and 30-day return policy.',
};

export default function ShippingReturnsPage() {
  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-8">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase block mb-2">
            CLIENT CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
            Shipping & Returns
          </h1>
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-[#252525]/80 font-light">
          <div className="p-6 sm:p-8 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#252525]">
              Domestic & Global Delivery
            </h3>
            <p>
              We provide complimentary insured standard shipping on all orders over $150. Orders placed before 2:00 PM EST are packaged in our signature recycled boxes and dispatched within 24 to 48 business hours.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#252525]">
              30-Day Bespoke Returns Window
            </h3>
            <p>
              Garments may be returned or exchanged within 30 days of delivery, provided items are unworn, unwashed, and retained with original atelier tags and packaging intact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
