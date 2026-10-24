import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | FashionStore',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Terms & Conditions</h1>
      <p className="text-sm text-slate-500">Last updated: October 2026</p>
      <div className="text-sm leading-relaxed space-y-4 text-slate-700">
        <p>
          Welcome to FashionStore. By browsing this website and purchasing our garments, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <h3 className="text-base font-bold text-slate-900 pt-4">1. Product Descriptions & Sizing</h3>
        <p>
          We strive for chromatic accuracy in our product photography. However, monitor displays may vary slightly. Sizing charts are provided on each product page for measurements in inches and centimeters.
        </p>
        <h3 className="text-base font-bold text-slate-900 pt-4">2. Order Acceptance</h3>
        <p>
          Receipt of an electronic order confirmation does not signify our final acceptance of your order. We reserve the right at any time after receipt of your order to decline or limit the order quantity for any reason.
        </p>
      </div>
    </div>
  );
}
