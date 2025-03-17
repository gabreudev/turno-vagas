import { z } from 'zod';
import { shiftSchema } from '../shift.dto';

export const createShiftResponseSchema = shiftSchema;

export type CreateShiftResponseDto = z.infer<typeof createShiftResponseSchema>;

export const createShiftStringDatesResponseSchema =
  createShiftResponseSchema.extend({
    createdAt: z.string(),
    updatedAt: z.string(),
  });

  
export type CreateShiftStringDatesResponseDto = z.infer<
  typeof createShiftStringDatesResponseSchema
>;
