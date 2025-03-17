import { AlreadyExistsError } from '@/common/errors/already-exists-error';
import { NotFoundError } from '@/common/errors/not-found-error';
import type { CreateShiftRequestDto } from '@/common/validations/shift/create-shift/create-shift-request.dto';
import type { CreateShiftResponseDto } from '@/common/validations/shift/create-shift/create-shift.reponse.dto';
import type { DbService } from '@/modules/db/db.service';
import { minutesToTimeString } from '@/utils/format-time';

import type { ShiftsService } from '../shifts.service';

export class CreateShiftUseCase {
  constructor(
    private readonly dbService: DbService,
    private readonly shiftsService: ShiftsService,
  ) {}

  async execute(
    createShiftRequestDto: CreateShiftRequestDto,
  ): Promise<CreateShiftResponseDto> {
    const shiftExists = await this.dbService.shift.findFirst({
      where: {
        userId: createShiftRequestDto.userId,
        weekDay: createShiftRequestDto.weekDay,
        OR: [
          {
            startAt: { gte: createShiftRequestDto.startAt },
            endAt: { lte: createShiftRequestDto.endAt },
          },
          {
            startAt: { lt: createShiftRequestDto.startAt },
            endAt: { gt: createShiftRequestDto.endAt },
          },
          {
            startAt: { lte: createShiftRequestDto.endAt },
            endAt: { gte: createShiftRequestDto.startAt },
          },
        ],
      },
    });

    if (shiftExists) {
      throw new AlreadyExistsError(
        'Shift',
        'startAt - endAt',
        `Current shift: ${minutesToTimeString(createShiftRequestDto.startAt)} - ${minutesToTimeString(createShiftRequestDto.endAt)}\nShift that matches: ${minutesToTimeString(shiftExists.startAt)} - ${minutesToTimeString(shiftExists.endAt)}`,
      );
    }

    const id = createShiftRequestDto.userId;

    const user = await this.dbService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User', 'id', id.toString());
    }

    const newShift = await this.dbService.shift.create({
      data: createShiftRequestDto,
    });

    this.shiftsService.sendApprovalShiftForAdmins(
      user.email,
      user.name,
      createShiftRequestDto.weekDay.toString(),
      minutesToTimeString(createShiftRequestDto.startAt),
      minutesToTimeString(createShiftRequestDto.endAt),
    );

    return newShift;
  }
}
