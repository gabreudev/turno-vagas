'use client';

import { USER_HISTORYS_CACHE_KEY } from '@/common/constants/cache';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { addShiftsToHistory } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function RefreshHistoryButton(): JSX.Element {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onClick(): Promise<void> {
    setIsLoading(true);
    const response = await addShiftsToHistory();
    setIsLoading(false);

    if (!response.ok) {
      const { dismiss } = toast({
        title: 'Erro ao adicionar turnos ao histórico',
        description: response.error,
        className: 'bg-destructive text-white',
      });

      setTimeout(dismiss, 2500);

      return;
    }

    await queryClient.invalidateQueries({ queryKey: USER_HISTORYS_CACHE_KEY });

    const { dismiss } = toast({
      title: 'Turnos adicionados ao histórico',
      description: 'Os turnos foram adicionados ao histórico com sucesso',
      className: 'bg-green-500 text-white',
    });

    setTimeout(dismiss, 2500);
  }

  return (
    <Button onClick={onClick} variant={'outline'}>
      {isLoading ? <Loader2 className="h-5 w-5" /> : 'Atualizar histórico'}
    </Button>
  );
}
