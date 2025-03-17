import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShiftsTable } from '@/components/user/shifts-table';
import { getShiftsByUser } from '../../actions';
import { USER_SHIFTS_CACHE_KEY } from '@/common/constants/cache';
import { QueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}): Promise<JSX.Element> {
  const { id: userId } = z
    .object({
      id: z.string().transform(Number),
    })
    .parse(params);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [USER_SHIFTS_CACHE_KEY],
    queryFn: () => getShiftsByUser(userId),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold md:text-3xl lg:text-4xl">
          Turnos
        </CardTitle>
        <CardDescription className="mt-2 text-lg text-muted-foreground md:text-xl">
          Gerenciar turnos cadastrados no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShiftsTable userId={userId} />
      </CardContent>
    </Card>
  );
}
