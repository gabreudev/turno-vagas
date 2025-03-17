import { NotFoundError } from '@/common/errors/not-found-error';
import type { UpdateUserRequestDto } from '@/common/validations/users/update-user/update-user-request.dto';
import type { UpdateUserResponseDto } from '@/common/validations/users/update-user/update-user-response.dto';
import type { DbService } from '@/modules/db/db.service';
import type { UsersService } from '../users.service';

export class UpdateUserUseCase {
  constructor(
    private readonly dbService: DbService,
    private readonly userService: UsersService,
  ) {}

  async execute(
    id: number,
    updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.dbService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User', 'id', id.toString());
    }

    const updatedUser = await this.dbService.user.update({
      where: { id },
      data: updateUserRequestDto,
    });

    if (user.isBanned && !updatedUser.isBanned) {
      await this.userService.sendApprovalEmail(user.email, user.name);
    }

    return updatedUser;
  }
}
