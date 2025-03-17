import { NotFoundError } from '@/common/errors/not-found-error';
import type { UpdateShiftRequestDto } from '@/common/validations/shift/update-shifts/update-shift-request.dto';
import type { UpdateShiftResponseDto } from '@/common/validations/shift/update-shifts/update-shift-response.dto';
import type { DbService } from '@/modules/db/db.service';
import { minutesToTimeString } from '@/utils/format-time';
import { ShiftStatus } from '@prisma/client';
import type { ShiftsService } from '../shifts.service';

export class UpdateShiftUseCase {
  constructor(
    private readonly dbService: DbService,
    private readonly shiftsService: ShiftsService,
  ) {}

  async execute(
    id: number,
    updateShiftRequestDto: UpdateShiftRequestDto,
  ): Promise<UpdateShiftResponseDto> {
    const shift = await this.dbService.shift.findUnique({
      where: { id },
    });

    if (!shift) {
      throw new NotFoundError('Shift', 'id', id.toString());
    }

    const user = await this.dbService.user.findUnique({
      where: { id: shift.userId },
    });

    if (!user) {
      throw new NotFoundError('User', 'id', shift.userId.toString());
    }

    const updatedShift = await this.dbService.shift.update({
      where: { id },
      data: updateShiftRequestDto,
    });

    if (
      shift.status === ShiftStatus.APROVADO &&
      updatedShift.status === ShiftStatus.REJEITADO
    ) {
      const { weekDay, startAt, endAt } = shift;

      this.shiftsService.sendRejectedShiftNotification(
        user.email,
        user.name,
        weekDay.toString(),
        minutesToTimeString(startAt),
        minutesToTimeString(endAt),
      );

      return updatedShift;
    }

    if (
      shift.status === ShiftStatus.PENDENTE &&
      updatedShift.status === ShiftStatus.APROVADO
    ) {
      this.shiftsService.sendApprovedShiftNotification(
        user.email,
        user.name,
        shift.weekDay.toString(),
        minutesToTimeString(shift.startAt),
        minutesToTimeString(shift.endAt),
      );
    }
    if (
      shift.status === ShiftStatus.PENDENTE &&
      updatedShift.status === ShiftStatus.REJEITADO
    ) {
      this.shiftsService.sendRejectedShiftNotification(
        user.email,
        user.name,
        shift.weekDay.toString(),
        minutesToTimeString(shift.startAt),
        minutesToTimeString(shift.endAt),
      );
    }
    return updatedShift;
  }
}
