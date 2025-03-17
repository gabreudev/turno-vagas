'use client';

import { updateHistory } from '@/app/actions';
import { USER_HISTORYS_CACHE_KEY } from '@/common/constants/cache';
import type { HistoryStringDatesDto } from '@/common/validations/history/history.dto';
import { useToast } from '@/hooks/use-toast';
import { minutesToTimeString } from '@/utils/format-time';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
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
import type { GetHistoryStringDatesResponseDto } from '@/common/validations/history/get-history/get-history-response.dto';

interface UpdateHistoryDialogProps {
  history: HistoryStringDatesDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getUserName: (userId: number) => string;
}

export function UpdateHistoryDialog({
  history,
  open,
  onOpenChange,
  getUserName,
}: UpdateHistoryDialogProps): JSX.Element | null {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  async function onUpdate(): Promise<void> {
    if (!history) {
      return;
    }

    setIsLoading(true);

    const newStatus = !history.isPresent;

    const response = await updateHistory(history.id, { isPresent: newStatus });

    setIsLoading(false);

    if (!response.ok) {
      toast({
        title: 'Erro ao atualizar status',
        description: response.error,
        className: 'bg-destructive text-white',
      });

      return;
    }

    queryClient.setQueryData(
      [USER_HISTORYS_CACHE_KEY],
      (data: GetHistoryStringDatesResponseDto) => {
        if (!data) {
          return data;
        }

        return data.map((item: HistoryStringDatesDto) =>
          item.id === history.id ? { ...item, isPresent: newStatus } : item,
        );
      },
    );

    // invalida a query
    await queryClient.invalidateQueries({
      queryKey: [USER_HISTORYS_CACHE_KEY],
    });

    toast({
      title: 'Status atualizado',
      description: `Registro alterado para ${newStatus ? 'Presente' : 'Ausente'} com sucesso.`,
      className: 'bg-green-500 text-white',
    });

    onOpenChange(false);
  }

  if (!history) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja mesmo alterar o status de{' '}
            {history.isPresent ? 'Presente' : 'Ausente'} para{' '}
            {history.isPresent ? 'Ausente' : 'Presente'}?
            <br />
            <br />
            <strong>Data:</strong>{' '}
            {new Date(history.relatedDate).toLocaleDateString('pt-BR')}
            <br />
            <strong>Usuário:</strong> {getUserName(history.userId)}
            <br />
            <strong>Horário:</strong> {minutesToTimeString(history.startAt)} -{' '}
            {minutesToTimeString(history.endAt)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onUpdate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Confirmar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
