import ProductListingPage from '@/components/shop/ProductListingPage';

export const metadata = { title: "Women's Jackets & Blazers" };

export default function WomenOuterwearPage() {
  return (
    <ProductListingPage
      heading="Jackets & Blazers"
      subheading="Women / Outerwear"
      categorySlug="outerwear"
      gender="women"
      description="Layer with intention — structured blazers, lightweight jackets and luxurious coats."
      products={[]}
    />
  );
}
