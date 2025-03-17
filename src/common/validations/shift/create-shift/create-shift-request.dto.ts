import { z } from 'zod';
import { weekDaySchema } from '../shift.dto';
import { SHIFT_END_AT, SHIFT_START_AT } from '@/common/constants/schedule';

export const createShiftRequestSchema = z.object({
  weekDay: weekDaySchema,
  startAt: z
    .number()
    .int()
    .min(SHIFT_START_AT * 60)
    .max(SHIFT_END_AT * 60),
  endAt: z
    .number()
    .int()
    .min(SHIFT_START_AT * 60)
    .max(SHIFT_END_AT * 60),
  userId: z.number().int().positive(),
});

export type CreateShiftRequestDto = z.infer<typeof createShiftRequestSchema>;
