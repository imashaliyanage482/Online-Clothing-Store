import React from 'react';

export const metadata = {
  title: 'Privacy Policy | FashionStore',
  description: 'Our commitment to data privacy, secure processing, and customer trust.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-8">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase block mb-2">
            CLIENT TRUST
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
            Privacy Policy
          </h1>
        </div>

        <div className="p-8 bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 space-y-6 text-sm sm:text-base leading-relaxed text-[#252525]/80 font-light">
          <p>
            At FashionStore, we respect your privacy and are committed to safeguarding the personal information you entrust to us. This Privacy Policy details our data collection, encryption, and secure checkout practices.
          </p>
          <h3 className="font-serif text-lg font-bold text-[#252525] pt-2">
            Secure Payment Architecture
          </h3>
          <p>
            All electronic payment transactions are encrypted using strict TLS and processed via PCI-DSS compliant payment gateways. FashionStore never stores raw payment card numbers or security codes on our servers.
          </p>
          <h3 className="font-serif text-lg font-bold text-[#252525] pt-2">
            Data Usage & Discretion
          </h3>
          <p>
            Your information is used solely to fulfill orders, provide customized sizing recommendations, and communicate private editorial drops. We never sell customer records to third-party advertisers.
          </p>
        </div>
      </div>
    </div>
  );
}
