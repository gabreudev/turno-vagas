import { getUsers } from '@/app/actions';
import UsersTable from '@/components/users/users-table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { USERS_CACHE_KEY } from '@/common/constants/cache';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function UsersPage(): Promise<JSX.Element> {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [USERS_CACHE_KEY],
    queryFn: () => getUsers(),
  });

  return (
    <Card className="flex h-[calc(100vh-6rem)] flex-col">
      <CardHeader className="px-7">
        <CardTitle className="text-3xl font-bold text-primary">
          Usuários
        </CardTitle>
        <CardDescription className="text-lg">
          Gerenciamento de usuários do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <UsersTable />
        </HydrationBoundary>
      </CardContent>
    </Card>
  );
}
