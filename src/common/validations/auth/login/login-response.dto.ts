import { z } from 'zod';
import { userSchema } from '../../users/user.dto';

export const loginTokenSchema = userSchema
  .pick({
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
  })
  .extend({
    exp: z.number(),
  });

export type LoginTokenDto = z.infer<typeof loginTokenSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
});

export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
