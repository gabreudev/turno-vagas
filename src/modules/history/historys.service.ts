import {
  shiftStatusSchema,
  weekDaySchema,
} from '@/common/validations/shift/shift.dto';
import type { DbService } from '../db/db.service';
import type { GetShiftsUseCase } from '../shifts/use-cases/get-shifts.use-case';
import type { Prisma } from '@prisma/client';

export class HistoriesService {
  constructor(
    private readonly dbService: DbService,
    private readonly getShiftsUseCase: GetShiftsUseCase,
  ) {}

  async addShiftsToHistory(): Promise<void> {
    const history = await this.dbService.history.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const now = new Date();

    // If the history was updated today, we don't need to update it again
    if (history?.createdAt.getDate() === now.getDate()) {
      // TODO: Update error
      throw new Error('History already updated today');
      return;
    }

    const currentWeekDay = new Date().getDay(); // Returns 0-6

    const weekDayValues = [
      weekDaySchema.enum.DOMINGO,
      weekDaySchema.enum.SEGUNDA,
      weekDaySchema.enum.TERCA,
      weekDaySchema.enum.QUARTA,
      weekDaySchema.enum.QUINTA,
      weekDaySchema.enum.SEXTA,
      weekDaySchema.enum.SABADO,
    ];

    const currentWeekDayEnum = weekDayValues[currentWeekDay];

    const shifts = await this.getShiftsUseCase.execute({
      status: shiftStatusSchema.enum.APROVADO,
      weekDay: currentWeekDayEnum,
    });

    const shiftsRegisteredADayAgoOrMore = shifts.filter((shift) => {
      const shiftDate = new Date(shift.startAt);
      const diffInTime = now.getTime() - shiftDate.getTime();
      const diffInHours = diffInTime / (1000 * 3600);
      return diffInHours >= 24;
    });

    const historyData: Prisma.HistoryCreateManyInput[] =
      shiftsRegisteredADayAgoOrMore.map((shift) => {
        return {
          userId: shift.userId,
          weekDay: shift.weekDay,
          startAt: shift.startAt,
          endAt: shift.endAt,
          relatedDate: now,
        };
      });

    await this.dbService.history.createMany({
      data: historyData,
    });
  }
}
