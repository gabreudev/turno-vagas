'use client';

import { getShiftsByUser } from '@/app/actions';
import { USER_SHIFTS_CACHE_KEY } from '@/common/constants/cache';

import type {
  ShiftStatusDto,
  ShiftStringDatesDto,
} from '@/common/validations/shift/shift.dto';
import { shiftStatusSchema } from '@/common/validations/shift/shift.dto';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { NewShift } from './new-shift';
import { minutesToTimeString } from '@/utils/format-time';
import { DeleteShiftDialog } from './delete-shift';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

function getStatusBadge(status: ShiftStatusDto): JSX.Element {
  const statusConfig: Record<
    ShiftStatusDto,
    { label: string; variant: 'secondary' | 'default' | 'destructive' }
  > = {
    [shiftStatusSchema.enum.PENDENTE]: {
      label: 'Pendente',
      variant: 'secondary',
    },
    [shiftStatusSchema.enum.APROVADO]: {
      label: 'Aprovado',
      variant: 'default',
    },
    [shiftStatusSchema.enum.REJEITADO]: {
      label: 'Rejeitado',
      variant: 'destructive',
    },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface ShiftTableBodyProps {
  shifts: ShiftStringDatesDto[];
  onShiftDelete: (shift: ShiftStringDatesDto) => void;
}

export function ShiftTableBody({
  shifts,
  onShiftDelete,
}: ShiftTableBodyProps): JSX.Element {
  return (
    <TableBody>
      {shifts.map((shift) => (
        <TableRow key={shift.id}>
          <TableCell className="font-medium">{shift.weekDay}</TableCell>
          <TableCell>
            {minutesToTimeString(shift.startAt)} -{' '}
            {minutesToTimeString(shift.endAt)}
          </TableCell>
          <TableCell>{getStatusBadge(shift.status)}</TableCell>
          <TableCell className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onShiftDelete(shift)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Cancelar turno</span>
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

interface ShiftsTableProps {
  userId: number;
}

export function ShiftsTable({ userId }: ShiftsTableProps): JSX.Element {
  const {
    data: dataUserShifts,
    isLoading: isLoadingUserShifts,
    error: errorUserShifts,
  } = useQuery({
    queryKey: [USER_SHIFTS_CACHE_KEY],
    queryFn: () => getShiftsByUser(userId),
    // refetchOnMount: false,
    // refetchOnReconnect: false,
  });

  const { user } = useAuth();
  const { back } = useRouter();

  const [isNewShiftModalOpen, setIsNewShiftModalOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] =
    useState<ShiftStringDatesDto | null>(null);

  if (userId !== user?.id) {
    back();
  }

  if (isLoadingUserShifts) {
    // TODO: Add skeleton loader
    return <p>Carregando...</p>;
  }

  if (errorUserShifts || !dataUserShifts) {
    console.error(errorUserShifts);

    return <p>Ocorreu um erro ao carregar os turnos</p>;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setIsNewShiftModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Turno
        </Button>
      </div>

      {dataUserShifts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-6">
          <p className="text-lg text-muted-foreground">
            Nenhum turno encontrado
          </p>
          <Button onClick={() => setIsNewShiftModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Novo Turno
          </Button>
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
          <ShiftTableBody
            shifts={dataUserShifts}
            onShiftDelete={setShiftToDelete}
          />
        </Table>
      )}

      <NewShift
        userId={userId}
        isOpen={isNewShiftModalOpen}
        onOpenChange={setIsNewShiftModalOpen}
      />

      <DeleteShiftDialog
        shift={shiftToDelete}
        open={Boolean(shiftToDelete)}
        onOpenChange={() => {
          setShiftToDelete(null);
        }}
      />
    </>
  );
}
