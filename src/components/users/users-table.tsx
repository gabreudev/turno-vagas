'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';
import { getUsers } from '@/app/actions';
import { USERS_CACHE_KEY } from '@/common/constants/cache';
import { useQuery } from '@tanstack/react-query';
import { UserStatusBadge } from './user-status-badge';
import { useUserManagement } from '@/contexts/user-management-context';
import { stringToLocaleString } from '@/utils/string-to-date-string';
import { formatRole } from '@/utils/format-role';

export default function UsersTable(): JSX.Element {
  const { onSelectUser } = useUserManagement();

  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: [USERS_CACHE_KEY],
    queryFn: () => getUsers(),
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (isLoadingUsers) {
    // The items are first fetched at the server side, so it is not likely to need the loading state until we add pagination
    return <div>Loading...</div>;
  }

  if (errorUsers || !dataUsers) {
    console.log({ errorUsers });

    // TODO: Add generic error component
    return <div>Error fetching books</div>;
  }

  const dataUsersWithLocaleString = dataUsers.map((user) => {
    return {
      ...user,
      createdAt: stringToLocaleString(user.createdAt),
    };
  });

  return dataUsersWithLocaleString.length === 0 ? (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <AlertCircle className="mb-6 h-20 w-20 text-muted-foreground" />
      <p className="text-2xl font-semibold text-muted-foreground">
        Nenhum usuário encontrado
      </p>
      <p className="mt-2 text-lg text-muted-foreground">
        Novos usuários aparecerão aqui quando forem registrados
      </p>
    </div>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-lg font-semibold">Nome</TableHead>
          <TableHead className="hidden text-lg font-semibold md:table-cell">
            Cargo
          </TableHead>
          <TableHead className="text-lg font-semibold">Status</TableHead>
          <TableHead className="hidden text-lg font-semibold md:table-cell">
            Data de cadastro
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataUsersWithLocaleString.map((user) => (
          <TableRow
            key={user.id}
            className="cursor-pointer transition-colors hover:bg-accent"
            // TODO: Add accessibility for non interactive elements
            onClick={() => onSelectUser(user)}
          >
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {formatRole(user.role)}
            </TableCell>
            <TableCell>
              <UserStatusBadge {...user} />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <>{stringToLocaleString(user.createdAt)}</>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
