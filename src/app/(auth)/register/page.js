'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message || 'Failed to complete registration.');
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
          CLIENT REGISTRATION
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

      {/* ── Heading ── */}
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#252525]">
          Create an Account
        </h1>
        <p className="mt-1 text-xs text-[#252525]/70">
          Join FashionStore for personalized tailoring and order tracking.
        </p>
      </div>

      {/* ── Error Alert ── */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Registration Form ── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#252525] uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]/45">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Eleanor Vance"
              className="w-full rounded-xl border border-[#B69A7A]/40 bg-white/90 pl-10 pr-3.5 py-3 text-sm text-[#252525] placeholder-[#252525]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B69A7A]/60 focus:border-[#B69A7A]"
            />
          </div>
        </div>

        {/* Email Address */}
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="eleanor@example.com"
              className="w-full rounded-xl border border-[#B69A7A]/40 bg-white/90 pl-10 pr-3.5 py-3 text-sm text-[#252525] placeholder-[#252525]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B69A7A]/60 focus:border-[#B69A7A]"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#252525] uppercase tracking-wider">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]/45">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+94 77 123 4567"
              className="w-full rounded-xl border border-[#B69A7A]/40 bg-white/90 pl-10 pr-3.5 py-3 text-sm text-[#252525] placeholder-[#252525]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B69A7A]/60 focus:border-[#B69A7A]"
            />
          </div>
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#252525] uppercase tracking-wider">
            Password (Min 6 Characters)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]/45">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        {/* Premium Black Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-[#252525] text-[#F5F0E8] py-3.5 px-6 rounded-xl font-medium tracking-wider uppercase text-xs hover:bg-[#B69A7A] hover:text-[#252525] transition-all shadow-md active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#F5F0E8]" />
              <span>Registering Client Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* ── Link to Sign In ── */}
      <div className="text-center text-xs text-[#252525]/75 mt-6 pt-5 border-t border-[#B69A7A]/20">
        Already have an account?{' '}
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
