import { z } from 'zod';
import { shiftStatusSchema, weekDaySchema } from '../shift.dto';

export const getShiftsRequestParamsSchema = z.object({
  status: shiftStatusSchema.optional(),
  weekDay: weekDaySchema.optional(),
  // startAt: z.string().datetime().optional(),
  // endAt: z.string().datetime().optional(),
});

export type GetShiftsRequestParamsDto = z.infer<
  typeof getShiftsRequestParamsSchema
>;
