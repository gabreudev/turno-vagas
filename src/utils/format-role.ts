import type { RoleDto } from '@/common/validations/users/user.dto';
import { roleSchema } from '@/common/validations/users/user.dto';

export function formatRole(role: RoleDto): string {
  switch (role) {
    case roleSchema.enum.ADMINISTRADOR:
      return 'Administrador';
    case roleSchema.enum.TRABALHADOR:
      return 'Dentista';
  }
}
