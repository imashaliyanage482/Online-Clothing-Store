'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCurrency } from '@/context/CurrencyContext';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F0E8]" />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { settings, formatPrice } = useCurrency();
  const orderId = searchParams.get('orderId');
  const receiptKey = searchParams.get('key');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId || !receiptKey) {
      setError('This receipt link is incomplete.');
      return;
    }

    let active = true;
    fetch(`/api/orders/receipt/${encodeURIComponent(orderId)}?key=${encodeURIComponent(receiptKey)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load this receipt.');
        return data.order;
      })
      .then((receipt) => {
        if (active) setOrder(receipt);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, [orderId, receiptKey]);

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#252525] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FAF7F2] border border-[#B69A7A] rounded-full flex items-center justify-center mx-auto text-[#B69A7A] mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B69A7A]">
            Order Confirmed
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold">Thank You for Your Order</h1>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-8 text-center">
            <p role="alert" className="text-sm text-red-700">{error}</p>
            <Link href="/" className="inline-block mt-6">
              <Button>Home</Button>
            </Link>
          </div>
        ) : !order ? (
          <div className="rounded-2xl border border-[#B69A7A]/30 bg-[#FAF7F2] p-8 text-center text-sm">
            Preparing your receipt…
          </div>
        ) : (
          <>
            <article className="receipt-print bg-[#FAF7F2] rounded-2xl border border-[#B69A7A]/30 p-6 sm:p-10 shadow-sm">
              <header className="text-center border-b border-[#B69A7A]/30 pb-6">
                <p className="font-serif text-3xl font-bold tracking-[0.12em]">{settings.storeName}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#252525]/60">
                  Order Receipt
                </p>
              </header>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#B69A7A]/30 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#252525]/55">Order</p>
                  <p className="mt-1 font-mono font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-[#252525]/65">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#252525]/55">Customer</p>
                  <p className="mt-1 font-semibold">{order.customerName}</p>
                  <p className="text-xs text-[#252525]/65">{order.customerEmail}</p>
                  <p className="text-xs text-[#252525]/65">{order.customerPhone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-[#252525]/55">Delivery Address</p>
                  <p className="mt-1">{order.shippingAddress}</p>
                </div>
              </section>

              <section className="py-6 border-b border-[#B69A7A]/30">
                <h2 className="text-xs font-bold uppercase tracking-wider mb-4">Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id || `${item.productId}-${index}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.productTitle}</p>
                        <p className="text-xs text-[#252525]/65">
                          {[item.size, item.color, `Qty ${item.quantity}`].filter(Boolean).join(' · ')}
                        </p>
                        <p className="text-xs text-[#252525]/65">{formatPrice(item.price)} each</p>
                      </div>
                      <p className="font-semibold whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="max-w-sm ml-auto pt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between border-t border-[#B69A7A]/30 pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <p className="pt-2 text-xs text-[#252525]/65">
                  Payment: {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Pay on Delivery' : 'Card'} · {order.paymentStatus}
                </p>
              </section>
            </article>

            <div className="receipt-actions flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>
              <Link href="/">
                <Button variant="secondary" className="w-full">Home</Button>
              </Link>
            </div>
          </>
        )}
      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .receipt-print,
          .receipt-print * {
            visibility: visible !important;
          }
          .receipt-print {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            max-width: none !important;
            border: 0 !important;
            box-shadow: none !important;
          }
          .receipt-actions {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
