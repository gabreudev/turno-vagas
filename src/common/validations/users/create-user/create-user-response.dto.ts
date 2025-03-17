import { z } from 'zod';
import { userSchema } from '../user.dto';

export const createUserResponseSchema = userSchema.omit({ password: true });

export type CreateUserResponseDto = z.infer<typeof createUserResponseSchema>;

export const createUserStringDatesResponseSchema =
  createUserResponseSchema.extend({
    createdAt: z.string(),
    updatedAt: z.string(),
  });

export type CreateUserStringDatesResponseDto = z.infer<
  typeof createUserStringDatesResponseSchema
>;
