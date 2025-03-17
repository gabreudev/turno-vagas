import { UserWrapper } from '@/components/users/user-wrapper';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <UserWrapper>{children}</UserWrapper>;
}
