'use client';

import { USER } from '@/common/constants/routes';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';

export default function DefaultUserPage(): void {
  const { user } = useAuth();

  redirect(`${USER}/${user?.id}`);
}
