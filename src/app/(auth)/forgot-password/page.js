'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered email address and we will send you recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
          <p className="text-xs font-semibold text-emerald-800">
            Password recovery link has been dispatched to {email}.
          </p>
          <Link href="/login" className="text-xs font-bold text-slate-900 underline block pt-2">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
          />
          <Button type="submit" size="lg" className="w-full">
            Send Reset Instructions
          </Button>
        </form>
      )}

      <div className="text-center text-xs">
        <Link href="/login" className="text-slate-500 hover:text-slate-900">
          Remembered your credentials? Sign In
        </Link>
      </div>
    </div>
  );
}
