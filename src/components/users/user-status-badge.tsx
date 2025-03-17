import type { UserStringDatesWithoutPasswordDto } from '@/common/validations/users/user.dto';
import { Badge } from '../ui/badge';

export function UserStatusBadge({
  isEmailVerified,
  isBanned,
}: UserStringDatesWithoutPasswordDto): JSX.Element {
  return !isEmailVerified ? (
    <Badge className="text-xs" variant="outline">
      Verificar email
    </Badge>
  ) : (
    <Badge
      className="text-xs"
      variant={isBanned === true ? 'destructive' : 'secondary'}
    >
      {isBanned ? 'Banido' : 'Ativo'}
    </Badge>
  );
}
