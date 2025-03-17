'use client';

import { Button } from '@/components/ui/button';
import { UserStatusBadge } from '@/components/users/user-status-badge';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, User, UserX } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import type {
  RoleDto,
  UserStringDatesWithoutPasswordDto,
} from '@/common/validations/users/user.dto';
import { roleSchema } from '@/common/validations/users/user.dto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUser } from '@/app/actions';
import { USERS_CACHE_KEY } from '@/common/constants/cache';
import { useQueryClient } from '@tanstack/react-query';
import { formatRole } from '@/utils/format-role';

interface UserRoleSelectProps {
  currentRole: RoleDto;
  onRoleChange: (role: RoleDto) => void;
}

function UserRoleSelect({
  currentRole,
  onRoleChange,
}: UserRoleSelectProps): JSX.Element {
  return (
    <Select value={currentRole} onValueChange={onRoleChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(roleSchema.enum).map((role) => {
          return (
            <SelectItem key={role} value={role}>
              {formatRole(role)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

interface UserManagementContextValue {
  selectedUser: UserStringDatesWithoutPasswordDto | null;
  onSelectUser: (user: UserStringDatesWithoutPasswordDto) => void;
}

const UserManagementContext = createContext<
  UserManagementContextValue | undefined
>(undefined);

interface UserManagementProviderProps {
  children: React.ReactNode;
}

export function UserManagementProvider({
  children,
}: UserManagementProviderProps): JSX.Element {
  const [selectedUser, setSelectedUser] =
    useState<UserStringDatesWithoutPasswordDto | null>(null);
  const [currentRole, setCurrentRole] = useState<RoleDto | null>(
    selectedUser?.role ?? null,
  );
  const [isCurrentlyBanned, setIsCurrentlyBanned] = useState<boolean | null>(
    selectedUser?.isBanned ?? null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  function onSelectUser(user: UserStringDatesWithoutPasswordDto): void {
    setSelectedUser(user);
  }

  function handleRoleChange(role: RoleDto): void {
    setCurrentRole(role);
  }

  function handleStatusChange(): void {
    setIsCurrentlyBanned((prev) => !prev);
  }

  function onClose(): void {
    setSelectedUser(null);
    setCurrentRole(null);
    setIsCurrentlyBanned(null);
    setIsLoading(false);
    setError(null);
  }

  async function onSave(): Promise<void> {
    if (!selectedUser) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await updateUser(selectedUser.id, {
      role: currentRole ?? selectedUser.role,
      isBanned: isCurrentlyBanned ?? selectedUser.isBanned,
    });

    setIsLoading(false);

    if (!response.ok) {
      setError(response.error);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: [USERS_CACHE_KEY] });

    onClose();
  }

  const isEmailVerified = selectedUser?.isEmailVerified;

  useEffect(
    function loadSelectedUser() {
      if (!selectedUser) {
        return;
      }

      setCurrentRole(selectedUser.role);
      setIsCurrentlyBanned(selectedUser.isBanned);
    },
    [selectedUser],
  );

  return (
    <UserManagementContext.Provider value={{ selectedUser, onSelectUser }}>
      {children}

      {selectedUser ? (
        <Dialog open onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader className="flex flex-col gap-4">
              <DialogTitle className="text-2xl font-bold">
                {selectedUser.name}
              </DialogTitle>

              {isEmailVerified ? (
                <DialogDescription className="flex justify-between text-lg">
                  <p className="font-semibold">
                    {formatRole(selectedUser.role)}
                  </p>

                  <UserStatusBadge
                    {...{
                      ...selectedUser,
                      isBanned: isCurrentlyBanned ?? selectedUser.isBanned,
                      role: currentRole ?? selectedUser.role,
                    }}
                  />
                </DialogDescription>
              ) : null}
            </DialogHeader>

            {isEmailVerified ? (
              <>
                <div>
                  <p className="text-lg">
                    Data de Registro:{' '}
                    <span className="font-semibold">
                      <>{selectedUser.createdAt}</>
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <UserRoleSelect
                    currentRole={currentRole ?? selectedUser.role}
                    onRoleChange={handleRoleChange}
                  />

                  <Button
                    variant={
                      (isCurrentlyBanned ?? selectedUser?.isBanned)
                        ? 'default'
                        : 'destructive'
                    }
                    className="w-full py-6 text-lg"
                    onClick={handleStatusChange}
                  >
                    {(isCurrentlyBanned ?? selectedUser?.isBanned) ? (
                      <User />
                    ) : (
                      <UserX className="mr-2 h-5 w-5" />
                    )}
                    {(isCurrentlyBanned ?? selectedUser?.isBanned)
                      ? 'Ativar'
                      : 'Banir'}
                  </Button>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
              </>
            ) : (
              <DialogDescription className="text-center">
                Usuário não verificou o e-mail.
              </DialogDescription>
            )}

            <DialogFooter>
              {isEmailVerified ? (
                <Button
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full py-6 text-lg"
                  onClick={onSave}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Salvar'
                  )}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full py-6 text-lg"
                  onClick={onClose}
                >
                  Fechar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement(): UserManagementContextValue {
  const context = useContext(UserManagementContext);

  if (context === undefined) {
    throw new Error(
      'useUserManagement must be used within a UserManagementProvider',
    );
  }

  return context;
}
