import type { GetShiftsRequestParamsDto } from '@/common/validations/shift/get-shift/get-shifts-request.dto';
import type { GetShiftsResponseDto } from '@/common/validations/shift/get-shift/get-shifts-response.dto';
import type { DbService } from '@/modules/db/db.service';

export class GetShiftsUseCase {
  constructor(private readonly dbService: DbService) {}

  async execute(
    getShiftsRequestParamsSchema: GetShiftsRequestParamsDto = {},
  ): Promise<GetShiftsResponseDto> {
    const { status, weekDay } = getShiftsRequestParamsSchema;

    return this.dbService.shift.findMany({
      where: {
        user: {
          isBanned: false,
        },
        status,
        weekDay,
      },
      orderBy: [{ status: 'asc' }, { weekDay: 'asc' }, { startAt: 'asc' }],
    });
  }
}
