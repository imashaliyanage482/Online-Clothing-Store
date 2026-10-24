import React from 'react';
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import CustomerSidebar from '@/components/customer/CustomerSidebar';

export default function CustomerAccountLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <CustomerSidebar />
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
