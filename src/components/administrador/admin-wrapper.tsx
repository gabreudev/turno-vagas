'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Calendar1,
  Bell,
  Menu,
  CircleUser,
  Users,
  CalendarDays,
  History,
  LogOut,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Sheet, SheetTrigger, SheetContent } from '../ui/sheet';
import Link from 'next/link';
import { HISTORYS, LOGIN, SCHEDULES, USERS } from '@/common/constants/routes';
import { roleSchema } from '@/common/validations/users/user.dto';
import { Card, CardTitle, CardContent } from '../ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

interface AdminWrapperProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Usuários', icon: Users, href: USERS },
  { name: 'Agendamentos', icon: CalendarDays, href: SCHEDULES },
  { name: 'Históricos', icon: History, href: HISTORYS },
];

function NotAdmin(): JSX.Element {
  return (
    <Card className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4">
      <CardTitle className="text-center text-2xl">{`Você não é um ${roleSchema.enum.ADMINISTRADOR}`}</CardTitle>
      <CardContent className="flex flex-col items-center gap-4">
        <Button asChild>
          <Link href={LOGIN}>Ir para a tela de entrada</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// TODO: Refactor to this to split into reusable components
export function AdminWrapper({ children }: AdminWrapperProps): JSX.Element {
  const pathname = usePathname();
  const { refresh } = useRouter();
  const { user, logout } = useAuth();

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  if (user?.role !== roleSchema.enum.ADMINISTRADOR) {
    return <NotAdmin />;
  }

  function onLogoutClick(): void {
    logout();
    refresh();
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Calendar1 className="h-6 w-6" />
              <span>Turno Vagas</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(({ name, icon: Icon, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={name}
                    href={href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      isActive
                        ? 'bg-muted font-semibold text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {name}
                    {/* {badge && (
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        {badge}
                      </Badge>
                    )} */}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Menu mobile */}

          <Sheet
            open={isSheetOpen}
            onOpenChange={(isOpen) => setIsSheetOpen(isOpen)}
          >
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                {navItems.map(({ name, icon: Icon, href }) => {
                  const isActive = pathname === href;
                  return (
                    <button key={name} onClick={() => setIsSheetOpen(false)}>
                      <Link
                        href={href}
                        className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                          isActive
                            ? 'bg-muted font-semibold text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {name}
                        {/* {badge && (
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          {badge}
                        </Badge>
                      )} */}
                      </Link>
                    </button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1"></div>

          <Button variant="outline" onClick={onLogoutClick}>
            <LogOut />
          </Button>
          {/* <DropdownMenu open={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
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
          </DropdownMenu> */}
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
