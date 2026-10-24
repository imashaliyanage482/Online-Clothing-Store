import React from 'react';
import Link from 'next/link';
import CustomerHeader from '@/components/customer/CustomerHeader';
import { ArrowLeft, CheckCircle2, Truck, PackageCheck, Clock } from 'lucide-react';

export default function OrderTrackingPage({ params }) {
  const orderId = params.id;

  const steps = [
    { title: 'Order Confirmed', time: 'Oct 24, 09:15 AM', done: true, icon: CheckCircle2 },
    { title: 'Tailoring & Packaging Complete', time: 'Oct 24, 03:30 PM', done: true, icon: PackageCheck },
    { title: 'Handed to Courier (FedEx Priority)', time: 'Oct 24, 06:45 PM', done: true, current: true, icon: Truck },
    { title: 'Out for Final Delivery', time: 'Estimated Oct 26', done: false, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Orders</span>
      </Link>

      <CustomerHeader
        title={`Shipment Tracking - ${orderId}`}
        subtitle="Carrier: FedEx Express • Tracking Number: 748920194819"
      />

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                <span
                  className={`absolute -left-[33px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    step.done
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className={`text-sm font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{step.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
