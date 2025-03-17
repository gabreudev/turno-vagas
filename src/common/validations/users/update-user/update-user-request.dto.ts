import type { z } from 'zod';
import { userSchema } from '../user.dto';

export const updateUserRequestSchema = userSchema.partial().pick({
  isBanned: true,
  role: true,
});

export type UpdateUserRequestDto = z.infer<typeof updateUserRequestSchema>;
