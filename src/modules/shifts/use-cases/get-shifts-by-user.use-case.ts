import { NotFoundError } from '@/common/errors/not-found-error';
import type { GetShiftsResponseDto } from '@/common/validations/shift/get-shift/get-shifts-response.dto';
import type { DbService } from '@/modules/db/db.service';

export class GetShiftsByUserUseCase {
  constructor(private readonly dbService: DbService) {}

  async execute(userId: number): Promise<GetShiftsResponseDto> {
    const user = await this.dbService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User', 'id', userId.toString());
    }

    return this.dbService.shift.findMany({
      where: { userId },
      orderBy: [{ weekDay: 'asc' }, { startAt: 'asc' }],
    });
  }
}
