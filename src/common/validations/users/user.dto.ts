// TODO: Decouple from Prisma if moving to separate repositories
import { Role } from '@prisma/client';
import { z } from 'zod';

export const roleSchema = z.nativeEnum(Role);

export type RoleDto = z.infer<typeof roleSchema>;

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  role: roleSchema,
  isEmailVerified: z.boolean(),
  isBanned: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserDto = z.infer<typeof userSchema>;

export const userWithoutPasswordSchema = userSchema.omit({ password: true });

export type UserWithoutPasswordDto = z.infer<typeof userWithoutPasswordSchema>;

export const userStringDatesWithoutPasswordSchema =
  userWithoutPasswordSchema.extend({
    createdAt: z.string(),
    updatedAt: z.string(),
  });

export type UserStringDatesWithoutPasswordDto = z.infer<
  typeof userStringDatesWithoutPasswordSchema
>;
