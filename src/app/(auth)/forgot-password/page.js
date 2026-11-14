'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#B69A7A]/35 p-6 sm:p-9 text-[#252525] transition-all">
      {/* ── Top Bar: Back to Login Link ── */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#252525]/70 hover:text-[#252525] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Sign In</span>
        </Link>
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase">
          CLIENT SUPPORT
        </span>
      </div>

      {/* ── Brand Logo & Header ── */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex flex-col items-center group mb-3">
          <span className="font-serif text-2xl sm:text-[27px] font-bold tracking-[0.14em] text-[#252525] uppercase leading-tight group-hover:text-[#B69A7A] transition-colors">
            FASHIONSTORE
          </span>
          <span className="text-[9px] tracking-[0.32em] text-[#B69A7A] font-semibold uppercase mt-1">
            WEAR YOUR STORY
          </span>
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#252525]">
          Reset Password
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#252525]/75 font-light">
          Enter your registered email address and we will dispatch recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
            Password recovery link has been dispatched to <strong className="text-emerald-950 font-bold">{email}</strong>.
          </p>
          <p className="text-[11px] text-emerald-800/80 font-light">
            Please inspect your inbox or spam directory. The link will expire in 60 minutes.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#252525] hover:text-[#B69A7A] underline"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#252525] uppercase tracking-wider">
              Account Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]/45">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-xl border border-[#B69A7A]/40 bg-white/90 pl-10 pr-3.5 py-3 text-sm text-[#252525] placeholder-[#252525]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B69A7A]/60 focus:border-[#B69A7A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#252525] text-[#F5F0E8] py-3.5 px-6 rounded-xl font-medium tracking-wider uppercase text-xs hover:bg-[#B69A7A] hover:text-[#252525] transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Send Reset Instructions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* ── Link to Sign In ── */}
      <div className="text-center text-xs text-[#252525]/75 mt-6 pt-5 border-t border-[#B69A7A]/20">
        Remember your password?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#252525] hover:text-[#B69A7A] hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
