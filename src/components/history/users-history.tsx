'use client';

import { getHistory, getUsers } from '@/app/actions';
import {
  USER_HISTORYS_CACHE_KEY,
  USERS_CACHE_KEY,
} from '@/common/constants/cache';
import type { HistoryStringDatesDto } from '@/common/validations/history/history.dto';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { minutesToTimeString } from '@/utils/format-time';
import { WeekDay } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle2,
  FilterX,
  Loader2,
  User,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { UpdateHistoryDialog } from './update-history-dialog';

// Função para obter o nome do dia da semana
function getDayOfWeek(day: WeekDay): string {
  const days: Record<WeekDay, string> = {
    [WeekDay.DOMINGO]: 'Dom',
    [WeekDay.SEGUNDA]: 'Seg',
    [WeekDay.TERCA]: 'Ter',
    [WeekDay.QUARTA]: 'Qua',
    [WeekDay.QUINTA]: 'Qui',
    [WeekDay.SEXTA]: 'Sex',
    [WeekDay.SABADO]: 'Sab',
  };
  return days[day];
}

type PresenceFilter = 'all' | 'present' | 'absent';

export function UsersHistory(): JSX.Element {
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [presenceFilter, setPresenceFilter] = useState<PresenceFilter>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedHistory, setSelectedHistory] =
    useState<HistoryStringDatesDto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Buscar usuários
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: [USERS_CACHE_KEY],
    queryFn: () => getUsers(),
  });

  // Buscar histórico
  const {
    data: history,
    isLoading: isLoadingHistory,
    error: errorHistory,
  } = useQuery({
    queryKey: [USER_HISTORYS_CACHE_KEY],
    queryFn: () => getHistory(),
  });

  // Verificar se está carregando ou se houve erro
  if (isLoadingUsers || isLoadingHistory) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
        <span>Carregando dados...</span>
      </div>
    );
  }

  if (errorUsers || errorHistory || !users || !history) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h3 className="text-xl font-semibold">Erro ao carregar dados</h3>
        <p className="mt-2 text-muted-foreground">
          {errorUsers instanceof Error
            ? errorUsers.message
            : errorHistory instanceof Error
              ? errorHistory.message
              : 'Ocorreu um erro ao buscar os dados.'}
        </p>
      </div>
    );
  }

  // Filtrar os registros com base nos filtros selecionados
  const filteredHistory = history.filter((entry) => {
    // Filtro de usuário
    if (selectedUserId !== 'all' && String(entry.userId) !== selectedUserId)
      return false;

    // Filtro de presença
    if (presenceFilter === 'present' && !entry.isPresent) return false;
    if (presenceFilter === 'absent' && entry.isPresent) return false;

    // Filtro de data
    if (startDate || endDate) {
      const entryDate = new Date(entry.relatedDate);
      if (startDate && entryDate < startDate) return false;
      if (endDate) {
        // Ajustar o endDate para o final do dia
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (entryDate > endOfDay) return false;
      }
    }

    return true;
  });

  // Contadores para os cards
  const presentCount = filteredHistory.filter(
    (entry) => entry.isPresent,
  ).length;
  const absentCount = filteredHistory.filter(
    (entry) => !entry.isPresent,
  ).length;
  const totalCount = filteredHistory.length;

  const handlePresenceFilterClick = (filter: PresenceFilter): void => {
    if (presenceFilter === filter) {
      setPresenceFilter('all');
    } else {
      setPresenceFilter(filter);
    }
  };

  const handleClearFilters = (): void => {
    setSelectedUserId('all');
    setPresenceFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const getUserName = (userId: number): string => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Usuário Desconhecido';
  };

  const handleOpenUpdateDialog = (entry: HistoryStringDatesDto): void => {
    setSelectedHistory(entry);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="user-filter">Filtrar por Usuário</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="user-filter">
                <SelectValue placeholder="Todos os usuários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-date">Data Inicial</Label>
            <div className="flex items-center rounded-md border px-3 py-2">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <input
                id="start-date"
                type="date"
                className="w-full bg-transparent outline-none"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setStartDate(
                    e.target.value ? new Date(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">Data Final</Label>
            <div className="flex items-center rounded-md border px-3 py-2">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <input
                id="end-date"
                type="date"
                className="w-full bg-transparent outline-none"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setEndDate(
                    e.target.value ? new Date(e.target.value) : undefined,
                  )
                }
                min={startDate ? startDate.toISOString().split('T')[0] : ''}
              />
            </div>
          </div>
        </div>

        {(selectedUserId !== 'all' ||
          presenceFilter !== 'all' ||
          startDate ||
          endDate) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <FilterX className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div
          className={`cursor-pointer rounded-lg border p-4 transition-colors ${
            presenceFilter === 'present' ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => handlePresenceFilterClick('present')}
        >
          <p className="text-sm text-muted-foreground">Total de Presenças</p>
          <p className="text-2xl font-bold">{presentCount}</p>
        </div>
        <div
          className={`cursor-pointer rounded-lg border p-4 transition-colors ${
            presenceFilter === 'absent' ? 'border-primary bg-primary/10' : ''
          }`}
          onClick={() => handlePresenceFilterClick('absent')}
        >
          <p className="text-sm text-muted-foreground">Total de Faltas</p>
          <p className="text-2xl font-bold">{absentCount}</p>
        </div>
        <div className="col-span-full w-full rounded-lg border p-4 sm:col-span-1 sm:w-auto">
          <p className="text-sm text-muted-foreground">Total de Registros</p>
          <p className="text-2xl font-bold">{totalCount}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Dia da Semana</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <p className="text-lg font-medium">
                    Nenhum registro encontrado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Não há registros que correspondam aos filtros selecionados
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredHistory.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {getUserName(entry.userId)}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(entry.relatedDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{getDayOfWeek(entry.weekDay)}</TableCell>
                <TableCell>
                  {minutesToTimeString(entry.startAt)} -{' '}
                  {minutesToTimeString(entry.endAt)}
                </TableCell>
                <TableCell>
                  <div
                    className="hover:shadow-mdcursor-pointer cursor-pointer rounded-md p-1 transition-all transition-colors duration-200 hover:scale-105 hover:bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:bg-gray-800"
                    onClick={() =>
                      handleOpenUpdateDialog({
                        ...entry,
                        relatedDate: new Date(entry.relatedDate).toISOString(),
                        createdAt: new Date(entry.createdAt).toISOString(),
                        updatedAt: new Date(entry.updatedAt).toISOString(),
                      })
                    }
                  >
                    {entry.isPresent ? (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Presente
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        Ausente
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <UpdateHistoryDialog
        history={selectedHistory}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        getUserName={getUserName}
      />
    </div>
  );
}
