import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-block group">
          <span className="text-2xl font-light tracking-[0.28em] text-slate-950 uppercase select-none">
            F A S H I O N<span className="font-normal lowercase tracking-normal text-xl text-amber-600">.lk</span>
          </span>
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
