import React from 'react';
import Link from 'next/link';
import CustomerHeader from '@/components/customer/CustomerHeader';
import { ArrowLeft, CheckCircle2, Truck, PackageCheck, Clock } from 'lucide-react';

export default function OrderTrackingPage({ params }) {
  const orderId = params.id;

  const steps = [
    { title: 'Order Confirmed', time: 'Oct 24, 09:15 AM', done: true, icon: CheckCircle2 },
    { title: 'Atelier Packaging Complete', time: 'Oct 24, 03:30 PM', done: true, icon: PackageCheck },
    { title: 'Handed to Courier (Domex Express)', time: 'Oct 24, 06:45 PM', done: true, current: true, icon: Truck },
    { title: 'Out for Final Delivery', time: 'Estimated Oct 26', done: false, icon: Clock },
  ];

  return (
    <div className="space-y-6 text-[#252525]">
      <Link
        href="/account/orders"
        className="text-xs text-[#252525]/70 hover:text-[#252525] flex items-center gap-1 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Orders</span>
      </Link>

      <CustomerHeader
        title={`Shipment Tracking - ${orderId}`}
        subtitle="Carrier: Domex Express • Consignment No: 748920194819"
      />

      <div className="bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-8 shadow-sm">
        <div className="relative pl-6 border-l-2 border-[#B69A7A]/30 space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                <span
                  className={`absolute -left-[33px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    step.done
                      ? 'bg-[#252525] text-[#F5F0E8]'
                      : 'bg-[#F5F0E8] text-[#252525]/40 border border-[#B69A7A]/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className={`text-sm font-bold ${step.done ? 'text-[#252525]' : 'text-[#252525]/40'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#252525]/60 mt-0.5 font-light">{step.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
