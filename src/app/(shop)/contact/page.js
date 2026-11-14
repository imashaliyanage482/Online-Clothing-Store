'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold tracking-[0.28em] text-[#B69A7A] uppercase block mb-2">
            CLIENT SERVICES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
            Customer Concierge
          </h1>
          <p className="mt-3 text-sm text-[#252525]/75 max-w-md mx-auto font-light leading-relaxed">
            Have an inquiry regarding garment sizing, custom fittings, or delivery status? Our private style concierges are at your service.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-8 sm:p-12 text-center space-y-4 shadow-sm animate-fadeIn">
            <div className="w-16 h-16 bg-[#F5F0E8] border border-[#B69A7A] rounded-full flex items-center justify-center mx-auto text-[#B69A7A]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#252525]">Message Received</h2>
            <p className="text-sm text-[#252525]/75 max-w-md mx-auto font-light leading-relaxed">
              Thank you, <strong className="font-semibold text-[#252525]">{formData.firstName}</strong>. Your inquiry has been routed to our Colombo atelier concierge. We typically respond within 24 business hours.
            </p>
            <div className="pt-4">
              <Button onClick={() => setSubmitted(false)} variant="secondary">
                Send Another Message
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-8 sm:p-10 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="First Name"
                required
                placeholder="Eleanor"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                required
                placeholder="Vance"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="eleanor@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#252525]">
                Message
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-[#B69A7A]/40 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#252525] placeholder-[#252525]/45 transition-colors focus:outline-none focus:ring-1 focus:ring-[#B69A7A] focus:border-[#B69A7A]"
                placeholder="How may our style advisors assist you?"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Inquiry
            </Button>

            <p className="text-center text-[11px] text-[#252525]/60 pt-2">
              Our atelier concierge typically responds within 24 business hours.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
