'use client';

import { updateShift } from '@/app/actions';
import { USER_SHIFTS_CACHE_KEY } from '@/common/constants/cache';
import type {
  ShiftStatusDto,
  ShiftStringDatesDto,
} from '@/common/validations/shift/shift.dto';
import { shiftStatusSchema } from '@/common/validations/shift/shift.dto';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { minutesToTimeString } from '@/utils/format-time';
import { useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

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

interface AdminShiftTableBodyProps {
  shifts: ShiftStringDatesDto[];
  onShiftDelete: (shift: ShiftStringDatesDto) => void;
}

export function AdminShiftTableBody({
  shifts,
}: AdminShiftTableBodyProps): JSX.Element {
  const [loadingShiftId, setLoadingShiftId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = async (
    shiftId: number,
    status: ShiftStatusDto,
  ): Promise<void> => {
    try {
      setLoadingShiftId(shiftId);

      const result = await updateShift(shiftId, { status });

      if (!result) {
        throw new Error('Failed to update shift status');
      }

      queryClient.setQueryData(
        [USER_SHIFTS_CACHE_KEY],
        (oldData: ShiftStringDatesDto[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map((shift) =>
            shift.id === shiftId ? { ...shift, status } : shift,
          );
        },
      );

      // Show success toast
      let toastMessage = {
        title: '',
        description: '',
        variant: 'default' as const,
      };

      if (status === 'APROVADO') {
        toastMessage = {
          title: 'Turno aprovado',
          description: 'O turno foi aprovado com sucesso.',
          variant: 'default',
        };
      } else if (status === 'REJEITADO') {
        toastMessage = {
          title: 'Turno rejeitado',
          description: 'O turno foi rejeitado com sucesso.',
          variant: 'default',
        };
      }

      toast(toastMessage);

      await queryClient.invalidateQueries({
        queryKey: [USER_SHIFTS_CACHE_KEY],
      });
    } catch (error) {
      console.error('Error updating shift status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description:
          'Ocorreu um erro ao atualizar o status do turno. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoadingShiftId(null);
    }
  };

  return (
    <TableBody>
      {shifts.map((shift) => {
        return (
          <TableRow key={shift.id}>
            <TableCell className="font-medium">{shift.weekDay}</TableCell>
            <TableCell>
              {minutesToTimeString(shift.startAt)} -{' '}
              {minutesToTimeString(shift.endAt)}
            </TableCell>
            <TableCell>{getStatusBadge(shift.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {/* May add a dialog do confirm action?*/}
                {shift.status === shiftStatusSchema.enum.PENDENTE && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() =>
                        handleStatusUpdate(
                          shift.id,
                          shiftStatusSchema.enum.APROVADO,
                        )
                      }
                      disabled={loadingShiftId === shift.id}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Aprovar turno</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        handleStatusUpdate(
                          shift.id,
                          shiftStatusSchema.enum.REJEITADO,
                        )
                      }
                      disabled={loadingShiftId === shift.id}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Rejeitar turno</span>
                    </Button>
                  </>
                )}

                {shift.status === shiftStatusSchema.enum.APROVADO && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                    onClick={() =>
                      handleStatusUpdate(
                        shift.id,
                        shiftStatusSchema.enum.REJEITADO,
                      )
                    }
                    disabled={loadingShiftId === shift.id}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancelar aprovação</span>
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
