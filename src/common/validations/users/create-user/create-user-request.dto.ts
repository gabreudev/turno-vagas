import { z } from 'zod';

export const createUserRequestSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
});

export type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>;
