import { USERS } from '@/common/constants/routes';
import { redirect } from 'next/navigation';

export default function AdminPage(): void {
  redirect(USERS);
}
