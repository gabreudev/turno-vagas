'use client';

import { useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import {
  createUserRequestSchema,
  type CreateUserRequestDto,
} from '@/common/validations/users/create-user/create-user-request.dto';
import { LOGIN } from '@/common/constants/routes';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function RegisterForm(): JSX.Element {
  const { register: registerUser } = useAuth();
  const { push } = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateUserRequestDto>({
    resolver: zodResolver(createUserRequestSchema),
  });

  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: CreateUserRequestDto): Promise<void> {
    setError(null);

    const response = await registerUser(data);

    if (!response.ok) {
      setError(response.error);
      return;
    }

    const { dismiss } = toast({
      title: 'Conta registrada com sucesso',
      description:
        'Próximas etapas: Verifique seu email e aguarde a aprovação do administrador',
      className: 'bg-green-500 text-white',
    });

    setTimeout(dismiss, 5000);

    setTimeout(function goToLoginPage() {
      push(LOGIN);
    }, 5500);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium">Nome</label>

        <Input
          {...register('name')}
          type="text"
          placeholder="Digite seu nome"
        />

        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

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
            'Registrar'
          )}
        </Button>

        <Link
          href={LOGIN}
          className="flex w-full justify-center bg-secondary text-xs text-primary hover:bg-secondary hover:underline"
        >
          Já tem uma conta? Entre
        </Link>
      </div>
    </form>
  );
}
