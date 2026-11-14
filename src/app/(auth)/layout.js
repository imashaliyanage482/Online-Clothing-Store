import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Client Authentication | FASHIONSTORE',
  description: 'Sign in or register for client access at FASHIONSTORE Atelier.',
};

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden bg-[#F5F0E8]">
      {/* ── 1. Soft, Faint Fashion Background Image ── */}
      <div className="fixed inset-0 -z-20 w-full h-full pointer-events-none">
        <Image
          src="/images/login-fashion-bg.png"
          alt="Fashion Wardrobe Atelier"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-15"
        />
      </div>

      {/* ── 2. Soft Tint Overlay ── */}
      <div className="fixed inset-0 -z-10 bg-[#F5F0E8]/80 backdrop-blur-[2px] transition-all pointer-events-none" />

      {/* ── 3. Centered Content Container with wider max width ── */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto animate-fadeIn">
        {children}
      </div>
    </div>
  );
}
