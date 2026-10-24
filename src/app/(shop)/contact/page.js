import React from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Contact Customer Concierge',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer Concierge</h1>
        <p className="mt-2 text-sm text-slate-500">
          Have an inquiry regarding garment sizing, delivery status, or custom fittings?
        </p>
      </div>

      <form className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First Name" required />
          <Input label="Last Name" required />
        </div>
        <Input label="Email Address" type="email" required />
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Message
          </label>
          <textarea
            rows={5}
            required
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="How can our style advisors assist you?"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Submit Inquiry
        </Button>
      </form>
    </div>
  );
}
