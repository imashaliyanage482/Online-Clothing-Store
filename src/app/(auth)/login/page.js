'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const registered = searchParams.get('registered');
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await login(email, password);
      setSuccess('Authenticated successfully! Preparing your session...');

      setTimeout(() => {
        const userRole = res?.role || res?.user?.role;
        if (userRole === 'ADMIN') {
          router.push(callbackUrl.startsWith('/admin') ? callbackUrl : '/admin/dashboard');
        } else {
          router.push(callbackUrl === '/' ? '/account' : callbackUrl);
        }
      }, 600);
    } catch (err) {
      setError(err.message || 'Invalid email address or password. Please verify your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#B69A7A]/35 p-6 sm:p-9 text-[#252525] transition-all">
      {/* ── Top Bar: Back to Home Link ── */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#252525]/70 hover:text-[#252525] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#B69A7A] uppercase">
          CLIENT ACCESS
        </span>
      </div>

      {/* ── Brand Logo ── */}
      <div className="text-center mb-4">
        <Link href="/" className="inline-flex flex-col items-center group mb-1">
          <span className="font-serif text-2xl sm:text-[27px] font-bold tracking-[0.14em] text-[#252525] uppercase leading-tight group-hover:text-[#B69A7A] transition-colors">
            FASHIONSTORE
          </span>
          <span className="text-[9px] tracking-[0.32em] text-[#B69A7A] font-semibold uppercase mt-1">
            WEAR YOUR STORY
          </span>
        </Link>
      </div>

      {/* ── Welcome Heading ── */}
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#252525]">
          Welcome Back
        </h1>
        <p className="mt-1 text-xs text-[#252525]/70">
          Sign in to discover your style.
        </p>
      </div>

      {/* ── Registered Confirmation Banner ── */}
      {registered && !error && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Account Created Successfully</strong>
            <span>Your atelier client profile is active. Please enter your credentials below.</span>
          </div>
        </div>
      )}

      {/* ── Success Alert ── */}
      {success && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* ── Error Alert ── */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Login Form ── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#252525] uppercase tracking-wider">
            Email Address
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
              placeholder="eleanor@example.com"
              className="w-full rounded-xl border border-[#B69A7A]/40 bg-white/90 pl-10 pr-3.5 py-3 text-sm text-[#252525] placeholder-[#252525]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B69A7A]/60 focus:border-[#B69A7A]"
            />
          </div>
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-semibold text-[#252525] uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#B69A7A] hover:text-[#252525] hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]/45">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#B69A7A]/40 bg-white/90 pl-10 pr-11 py-3 text-sm text-[#252525] placeholder-[#252525]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B69A7A]/60 focus:border-[#B69A7A]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#252525]/50 hover:text-[#252525] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#252525]/80 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[#B69A7A]/60 text-[#252525] focus:ring-[#B69A7A] focus:ring-offset-0 accent-[#252525] cursor-pointer"
            />
            <span className="font-light">Remember Me</span>
          </label>
        </div>

        {/* Premium Black Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-[#252525] text-[#F5F0E8] py-3.5 px-6 rounded-xl font-medium tracking-wider uppercase text-xs hover:bg-[#B69A7A] hover:text-[#252525] transition-all shadow-md active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#F5F0E8]" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* ── Link to Create Account ── */}
      <div className="text-center text-xs text-[#252525]/75 mt-6 pt-5 border-t border-[#B69A7A]/20">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-[#252525] hover:text-[#B69A7A] hover:underline transition-colors"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-[#252525] py-12">Loading Atelier Login...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
