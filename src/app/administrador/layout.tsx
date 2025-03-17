import { AdminWrapper } from '@/components/administrador/admin-wrapper';
import { UserManagementProvider } from '@/contexts/user-management-context';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <UserManagementProvider>
      <AdminWrapper>{children}</AdminWrapper>
    </UserManagementProvider>
  );
}
