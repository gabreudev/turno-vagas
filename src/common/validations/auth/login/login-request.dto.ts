import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
