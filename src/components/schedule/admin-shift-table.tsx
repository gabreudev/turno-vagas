'use client';

import { getShifts, getUsers } from '@/app/actions';
import {
  USER_SHIFTS_CACHE_KEY,
  USERS_CACHE_KEY,
} from '@/common/constants/cache';
import type { ShiftStringDatesDto } from '@/common/validations/shift/shift.dto';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2, User } from 'lucide-react';
import { useState } from 'react';
import { DeleteShiftDialog } from '../user/delete-shift';
import { AdminShiftTableBody } from './admin-shift-table-body';

export function AdminShiftsTable(): JSX.Element {
  const [shiftToDelete, setShiftToDelete] =
    useState<ShiftStringDatesDto | null>(null);

  const {
    data: users,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: [USERS_CACHE_KEY],
    queryFn: () => getUsers(),
  });

  const {
    data: allShifts,
    isLoading: isLoadingShifts,
    error: errorShifts,
  } = useQuery({
    queryKey: [USER_SHIFTS_CACHE_KEY],
    queryFn: () => getShifts(),
  });

  if (isLoadingUsers || isLoadingShifts) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
        <span>Carregando dados...</span>
      </div>
    );
  }

  // Error state
  if (errorUsers || errorShifts || !users || !allShifts) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h3 className="text-xl font-semibold">Erro ao carregar dados</h3>
        <p className="mt-2 text-muted-foreground">
          {errorUsers instanceof Error
            ? errorUsers.message
            : errorShifts instanceof Error
              ? errorShifts.message
              : 'Ocorreu um erro ao buscar os dados.'}
        </p>
      </div>
    );
  }

  const shiftsByUser = allShifts.reduce(
    (acc, shift) => {
      const userId = shift.userId;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(shift);
      return acc;
    },
    {} as Record<number, ShiftStringDatesDto[]>,
  );

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full">
        {users.map((user) => {
          const userShifts = shiftsByUser[user.id] || [];
          const pendingShifts = userShifts.filter(
            (shift) => shift.status === 'PENDENTE',
          );

          return (
            <AccordionItem key={user.id} value={`user-${user.id}`}>
              <AccordionTrigger className="rounded-lg px-4 hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>{user.name}</span>

                  <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {userShifts.length} turnos
                  </span>

                  {pendingShifts.length > 0 && (
                    <span className="bg-default-100 text-default-700 ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {pendingShifts.length} pendentes
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    {userShifts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-6">
                        <p className="text-lg text-muted-foreground">
                          Nenhum turno encontrado
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dia</TableHead>
                            <TableHead>Horário</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <AdminShiftTableBody
                          shifts={userShifts}
                          onShiftDelete={setShiftToDelete}
                        />
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <DeleteShiftDialog
        shift={shiftToDelete}
        open={Boolean(shiftToDelete)}
        onOpenChange={() => {
          setShiftToDelete(null);
        }}
      />
    </div>
  );
}
