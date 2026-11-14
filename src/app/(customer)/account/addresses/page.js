import { redirect } from 'next/navigation';

export default function CustomerAddressesRedirect() {
  redirect('/account/profile');
}
