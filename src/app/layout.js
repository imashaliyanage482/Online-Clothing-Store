import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: {
    default: 'FashionStore | Modern Apparel & Clothing Collections',
    template: '%s | FashionStore',
  },
  description: 'Curated premium fashion, seasonal apparel, and sustainable clothing essentials for men and women.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
