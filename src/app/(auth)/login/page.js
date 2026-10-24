'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (user.role === 'ADMIN') {
        router.push(callbackUrl.startsWith('/admin') ? callbackUrl : '/admin');
      } else {
        router.push(callbackUrl === '/' ? '/account' : callbackUrl);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
        <p className="mt-1 text-xs text-slate-500">Sign in to manage your orders, addresses, and wishlist.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-amber-600 hover:text-amber-700"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? 'Authenticating...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-xs text-slate-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-slate-900 hover:underline">
          Create an Account
        </Link>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <div className="font-bold text-slate-700">Demo Accounts:</div>
        <div>Admin: <code className="text-slate-800">admin@fashionstore.com</code> / <code className="text-slate-800">Admin@FashionStore2026</code></div>
        <div>Customer: <code className="text-slate-800">customer@example.com</code> / <code className="text-slate-800">Customer@123456</code></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-sm text-slate-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
