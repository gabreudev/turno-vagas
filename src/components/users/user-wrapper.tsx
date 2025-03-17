'use client';

import { LOGIN } from '@/common/constants/routes';
import { roleSchema } from '@/common/validations/users/user.dto';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { Calendar1, CircleUser } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface UserWrapperProps {
  children: React.ReactNode;
}

function NotUser(): JSX.Element {
  return (
    <Card className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4">
      <CardTitle className="text-center text-2xl">
        Acesso não autorizado
      </CardTitle>
      <CardContent className="flex flex-col items-center gap-4">
        <Button asChild>
          <Link href={LOGIN}>Ir para a tela de entrada</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function UserWrapper({ children }: UserWrapperProps): JSX.Element {
  const { user } = useAuth();

  if (user?.role !== roleSchema.enum.TRABALHADOR) {
    return <NotUser />;
  }

  return (
    <div className="min-h-screen w-full">
      <header className="flex h-14 items-center justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Calendar1 className="h-6 w-6" />
          <span className="text-lg">Turno Vagas</span>
        </Link>

        <DropdownMenu open={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Menu do usuário</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {children}
      </main>
    </div>
  );
}
