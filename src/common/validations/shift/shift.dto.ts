import { ShiftStatus, WeekDay } from '@prisma/client';
import { z } from 'zod';

export const weekDaySchema = z.nativeEnum(WeekDay);

export type WeekDayDto = z.infer<typeof weekDaySchema>;

export const shiftStatusSchema = z.nativeEnum(ShiftStatus);

export type ShiftStatusDto = z.infer<typeof shiftStatusSchema>;

export const shiftSchema = z.object({
  id: z.number(),
  weekDay: weekDaySchema,
  startAt: z.number().int().min(0),
  endAt: z.number().int().min(0),
  status: shiftStatusSchema,
  userId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ShiftDto = z.infer<typeof shiftSchema>;

export const shiftStringDatesSchema = shiftSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ShiftStringDatesDto = z.infer<typeof shiftStringDatesSchema>;

export const updateShiftResponseSchema = shiftSchema;
export type UpdateShiftResponseDto = z.infer<typeof updateShiftResponseSchema>;

export const updateShiftStringDatesResponseSchema = shiftStringDatesSchema;
export type UpdateShiftStringDatesResponseDto = z.infer<
  typeof updateShiftStringDatesResponseSchema
>;
