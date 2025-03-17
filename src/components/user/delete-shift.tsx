import type { ShiftStringDatesDto } from '@/common/validations/shift/shift.dto';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { minutesToTimeString } from '@/utils/format-time';
import { useQueryClient } from '@tanstack/react-query';
import { deleteShift } from '@/app/actions';
import { USER_SHIFTS_CACHE_KEY } from '@/common/constants/cache';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { GetShiftsStringDatesResponseDto } from '@/common/validations/shift/get-shift/get-shifts-response.dto';
import { useToast } from '@/hooks/use-toast';

interface DeleteShiftDialogProps {
  shift: ShiftStringDatesDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteShiftDialog({
  shift,
  open,
  onOpenChange,
}: DeleteShiftDialogProps): JSX.Element | null {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  async function onDelete(): Promise<void> {
    if (!shift) {
      return;
    }

    setIsLoading(true);
    const response = await deleteShift(shift.id);

    setIsLoading(false);

    if (!response.ok) {
      const { dismiss } = toast({
        title: 'Erro ao deletar turno',
        description: response.error,
        className: 'bg-destructive text-white',
      });

      setTimeout(dismiss, 2500);

      return;
    }

    queryClient.setQueryData(
      [USER_SHIFTS_CACHE_KEY],
      (data: GetShiftsStringDatesResponseDto) => {
        if (!data) {
          return data;
        }

        return data.filter((s) => s.id !== shift.id);
      },
    );

    await queryClient.invalidateQueries({ queryKey: USER_SHIFTS_CACHE_KEY });

    onOpenChange(false);
  }

  if (!shift) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o turno de {shift.weekDay} das{' '}
            {minutesToTimeString(shift.startAt)} às{' '}
            {minutesToTimeString(shift.endAt)}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
