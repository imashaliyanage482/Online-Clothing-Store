import { redirect } from 'next/navigation';

export default function CustomerSecurityRedirect() {
  redirect('/account/profile');
}
