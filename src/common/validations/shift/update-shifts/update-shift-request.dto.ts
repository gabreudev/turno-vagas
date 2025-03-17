import type { z } from 'zod';
import { shiftSchema } from '../shift.dto';

export const updateShiftRequestSchema = shiftSchema.partial().pick({
  status: true,
});

export type UpdateShiftRequestDto = z.infer<typeof updateShiftRequestSchema>;
