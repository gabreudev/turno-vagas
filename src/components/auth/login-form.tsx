'use client';

import { useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { LoginRequestDto } from '@/common/validations/auth/login/login-request.dto';
import { loginRequestSchema } from '@/common/validations/auth/login/login-request.dto';
import { REGISTER } from '@/common/constants/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LoginForm(): JSX.Element {
  const { refresh } = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginRequestDto>({ resolver: zodResolver(loginRequestSchema) });

  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: LoginRequestDto): Promise<void> {
    setError(null);

    const response = await login(data);

    if (!response.ok) {
      setError(response.error);
      return;
    }

    refresh();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium">E-mail</label>

        <Input
          {...register('email')}
          type="email"
          placeholder="Digite seu e-mail"
        />

        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Senha</label>

        <Input
          {...register('password')}
          type="password"
          placeholder="Digite sua senha"
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          className="w-full bg-primary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Entrar'
          )}
        </Button>

        <Link
          href={REGISTER}
          className="flex w-full justify-center bg-secondary text-xs text-primary hover:bg-secondary hover:underline"
        >
          Não tem uma conta? Registre-se
        </Link>
      </div>
    </form>
  );
}
