import React from 'react';

export const metadata = {
  title: 'Shipping & Returns Policy | FashionStore',
};

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Shipping & Returns</h1>
      <div className="text-sm leading-relaxed space-y-4 text-slate-700">
        <h3 className="text-base font-bold text-slate-900 pt-4">Domestic & International Shipping</h3>
        <p>
          We provide complimentary standard shipping on all orders over $150. Orders placed before 2:00 PM EST are packaged and dispatched within 24 to 48 business hours.
        </p>
        <h3 className="text-base font-bold text-slate-900 pt-4">30-Day Return Window</h3>
        <p>
          Garments may be returned or exchanged within 30 days of delivery, provided items are unworn, unwashed, and retained with original tags and packaging intact.
        </p>
      </div>
    </div>
  );
}
