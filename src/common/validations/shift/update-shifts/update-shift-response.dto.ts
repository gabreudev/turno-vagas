import type { z } from 'zod';
import { shiftSchema, shiftStringDatesSchema } from '../shift.dto';

export const updateShiftResponseSchema = shiftSchema;
export type UpdateShiftResponseDto = z.infer<typeof updateShiftResponseSchema>;

export const updateShiftStringDatesResponseSchema = shiftStringDatesSchema;
export type UpdateShiftStringDatesResponseDto = z.infer<
  typeof updateShiftStringDatesResponseSchema
>;
