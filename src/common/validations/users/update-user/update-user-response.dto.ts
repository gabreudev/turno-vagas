import type { z } from 'zod';
import {
  userWithoutPasswordSchema,
  userStringDatesWithoutPasswordSchema,
} from '../user.dto';

export const updateUserResponseSchema = userWithoutPasswordSchema;

export type UpdateUserResponseDto = z.infer<typeof updateUserResponseSchema>;

export const updateUserStringDatesResponseSchema =
  userStringDatesWithoutPasswordSchema;

export type UpdateUserStringDatesResponseDto = z.infer<
  typeof updateUserStringDatesResponseSchema
>;
