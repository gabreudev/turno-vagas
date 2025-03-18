'use client';

import { createShift } from '@/app/actions';
import { USER_SHIFTS_CACHE_KEY } from '@/common/constants/cache';
import { SHIFT_END_AT, SHIFT_START_AT } from '@/common/constants/schedule';
import type { CreateShiftRequestDto } from '@/common/validations/shift/create-shift/create-shift-request.dto';
import type { GetShiftsStringDatesResponseDto } from '@/common/validations/shift/get-shift/get-shifts-response.dto';
import type { ShiftStringDatesDto } from '@/common/validations/shift/shift.dto';
import {
  shiftStatusSchema,
  weekDaySchema,
} from '@/common/validations/shift/shift.dto';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { minutesToTimeString } from '@/utils/format-time';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface NewShiftProps {
  userId: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface IntervalSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  startAt: number;
  endAt: number;
  interval?: number;
  format?: (value: number) => string;
}

function IntervalSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  field,
  startAt,
  endAt,
  interval = 1,
  format = (value): string => value.toString(),
}: IntervalSelectProps<TFieldValues, TName>): JSX.Element {
  return (
    <Select
      onValueChange={(value) => field.onChange(Number(value))}
      defaultValue={field.value.toString()}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent className="xl:top-16">
        {Array.from(
          { length: Math.floor((endAt - startAt) / interval) + 1 },
          (_, i) => startAt + i * interval,
        ).map((value) => (
          <SelectItem key={value.toString()} value={value.toString()}>
            {format(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function NewShift({
  userId,
  isOpen,
  onOpenChange,
}: NewShiftProps): JSX.Element {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<CreateShiftRequestDto & { termsAccepted: boolean }>({
    defaultValues: {
      userId,
      weekDay: 'SEGUNDA',
      startAt: 7 * 60,
      endAt: 22 * 60,
      termsAccepted: false,
    },
  });

  const { toast } = useToast();

  const queryClient = useQueryClient();

  async function onSubmit(formData: CreateShiftRequestDto & { termsAccepted: boolean }): Promise<void> {
    const { termsAccepted, ...newShiftData } = formData
    const response = await createShift(newShiftData);

    if (!response.ok) {
      const { dismiss } = toast({
        title: 'Erro ao cadastrar turno',
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

        // TODO: Lets keep an eye on this, the data is missing some database fields
        data.push({
          ...newShiftData,
          status: shiftStatusSchema.enum.PENDENTE,
        } as ShiftStringDatesDto);

        return data.sort((a, b) => {
          const aWeekDayIndex = Object.values(weekDaySchema.enum).indexOf(
            a.weekDay,
          );
          const bWeekDayIndex = Object.values(weekDaySchema.enum).indexOf(
            b.weekDay,
          );

          if (aWeekDayIndex === bWeekDayIndex) {
            return a.startAt - b.startAt;
          }

          return aWeekDayIndex - bWeekDayIndex;
        });
      },
    );

    await queryClient.invalidateQueries({ queryKey: USER_SHIFTS_CACHE_KEY });

    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Turno</DialogTitle>
          {/* TODO: Please add constants for these intervals */}
          <DialogDescription>
            Cadastre um novo turno de trabalho. O horário deve estar entre 07:00
            e 22:00.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="dia">Dia da Semana</Label>

            <Controller
              name="weekDay"
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(weekDaySchema.enum).map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.weekDay && (
              <p className="text-sm text-destructive">
                {errors.weekDay?.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="start-at">Hora Inicial</Label>

            <Controller
              name="startAt"
              control={control}
              rules={{
                required: 'Campo obrigatório',
                min: {
                  value: SHIFT_START_AT * 60,
                  message: `O horário deve ser entre ${SHIFT_START_AT} e ${SHIFT_END_AT}`,
                },
                max: {
                  value: SHIFT_END_AT * 60,
                  message: `O horário deve ser entre ${SHIFT_START_AT} e ${SHIFT_END_AT}`,
                },
              }}
              render={({ field }) => (
                <IntervalSelect
                  field={field}
                  startAt={SHIFT_START_AT * 60}
                  endAt={SHIFT_END_AT * 60}
                  interval={15}
                  format={minutesToTimeString}
                />
              )}
            />

            {errors.startAt && (
              <p className="text-sm text-destructive">
                {errors.startAt.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="start-at">Hora Final</Label>

            <Controller
              name="endAt"
              control={control}
              rules={{
                required: 'Campo obrigatório',
                min: {
                  value: SHIFT_START_AT * 60,
                  message: `O horário deve ser entre ${SHIFT_START_AT} e ${SHIFT_END_AT}`,
                },
                max: {
                  value: SHIFT_END_AT * 60,
                  message: `O horário deve ser entre ${SHIFT_START_AT} e ${SHIFT_END_AT}`,
                },
              }}
              render={({ field }) => (
                <IntervalSelect
                  field={field}
                  startAt={SHIFT_START_AT * 60}
                  endAt={SHIFT_END_AT * 60}
                  interval={15}
                  format={minutesToTimeString}
                />
              )}
            />

            {errors.endAt && (
              <p className="text-sm text-destructive">{errors.endAt.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Controller
              name="termsAccepted"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="termsAccepted"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              )}
            />
            <Label
              htmlFor="termsAccepted"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Li e aceito os{' '}
              <a
                href="/termos.pdf"
                download="termos.pdf"
                className="cursor-pointer text-primary underline"
              >
                {' '}
                termos e condições.
              </a>
            </Label>
          </div>

          {errors.termsAccepted && (
            <p className="text-sm text-destructive">
              {errors.termsAccepted.message}
            </p>
          )}
          <div className="flex flex-col gap-2 md:w-full md:flex-row">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
              className="w-full"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !watch('termsAccepted')}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Cadastrar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
