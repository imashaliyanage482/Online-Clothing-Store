'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@fashionstore.com');
  const [password, setPassword] = useState('Admin@FashionStore2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.success) {
        if (res.user?.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          setError('Access denied: Administrator credentials required.');
        }
      } else {
        setError(res?.error || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setError(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block group mb-4">
          <span className="font-serif text-3xl font-bold tracking-[0.14em] text-[#252525] uppercase">
            FASHIONSTORE
          </span>
          <span className="block text-[9px] tracking-[0.35em] text-[#B69A7A] font-semibold uppercase mt-0.5">
            ATELIER OPERATIONS CONTROL
          </span>
        </Link>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Shield className="w-4 h-4 text-[#B69A7A]" />
          <h2 className="text-sm font-semibold tracking-wider text-[#252525] uppercase">
            Secure Admin Portal
          </h2>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FAF7F2] py-8 px-6 sm:px-10 rounded-2xl border border-[#B69A7A]/30 shadow-xl">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#B69A7A] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
                  placeholder="admin@fashionstore.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-[#252525] uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B69A7A] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-xs text-[#252525] rounded-xl border border-[#B69A7A]/40 focus:border-[#252525] focus:outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#252525] text-[#F5F0E8] text-xs font-semibold tracking-widest uppercase rounded-xl hover:bg-[#252525]/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <span>{loading ? 'Authenticating…' : 'Enter Admin Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-[#B69A7A]/25 text-center">
            <span className="text-[10.5px] font-medium text-[#252525]/70 block mb-2">
              Default Administrator Credentials:
            </span>
            <div className="inline-block bg-[#F5F0E8] px-3.5 py-2 rounded-lg border border-[#B69A7A]/30 text-left font-mono text-[11px] text-[#252525]">
              <div>Email: <strong>admin@fashionstore.com</strong></div>
              <div>Password: <strong>Admin@FashionStore2026</strong></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-[#252525]/75 hover:text-[#252525] transition-colors">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
