import type { GetUsersResponseDto } from '@/common/validations/users/get-users/get-users-response.dto';
import type { DbService } from '@/modules/db/db.service';

export class GetUsersUseCase {
  constructor(private readonly dbService: DbService) {}

  async execute(): Promise<GetUsersResponseDto> {
    return this.dbService.user.findMany({
      omit: { password: true },
      orderBy: { name: 'asc' },
    });
  }
}
