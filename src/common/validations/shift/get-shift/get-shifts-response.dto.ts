import { z } from 'zod';
import { shiftSchema, shiftStringDatesSchema } from '../shift.dto';

export const getShiftsResponseSchema = z.array(shiftSchema);

export type GetShiftsResponseDto = z.infer<typeof getShiftsResponseSchema>;

export const getShiftsStringDatesResponseSchema = z.array(
  shiftStringDatesSchema,
);

export type GetShiftsStringDatesResponseDto = z.infer<
  typeof getShiftsStringDatesResponseSchema
>;
