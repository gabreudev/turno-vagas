import { z } from 'zod';
import {
  userWithoutPasswordSchema,
  userStringDatesWithoutPasswordSchema,
} from '../user.dto';

export const getUsersResponseSchema = z.array(userWithoutPasswordSchema);

export type GetUsersResponseDto = z.infer<typeof getUsersResponseSchema>;

export const getUsersStringDatesResponseSchema = z.array(
  userStringDatesWithoutPasswordSchema,
);

export type GetUsersStringDatesResponseDto = z.infer<
  typeof getUsersStringDatesResponseSchema
>;
