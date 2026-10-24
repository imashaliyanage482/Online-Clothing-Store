import React from 'react';

export const metadata = {
  title: 'Privacy Policy | FashionStore',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      <p className="text-sm text-slate-500">Effective Date: October 2026</p>
      <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 text-slate-700">
        <p>
          At FashionStore, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy details our data collection, storage, and processing practices.
        </p>
        <h3 className="text-base font-bold text-slate-900 pt-4">1. Information We Collect</h3>
        <p>
          When you create an account, browse our apparel selections, or place an order, we collect identity data (name, email), shipping data (street address, telephone), and transaction data.
        </p>
        <h3 className="text-base font-bold text-slate-900 pt-4">2. Payment Security</h3>
        <p>
          All credit and debit card payments are processed via PCI-DSS compliant payment gateways (e.g., Stripe). FashionStore never stores raw credit card numbers or CVV codes on our servers.
        </p>
      </div>
    </div>
  );
}
