import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import { CurrencyProvider } from '@/context/CurrencyContext';

export default function ShopLayout({ children }) {
  return (
    <CurrencyProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CurrencyProvider>
  );
}
