import { NotFoundError } from '@/common/errors/not-found-error';
import type { DbService } from '@/modules/db/db.service';

export class DeleteShiftUseCase {
  constructor(private readonly dbService: DbService) {}

  async execute(shiftId: number): Promise<void> {
    const shift = await this.dbService.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      throw new NotFoundError("Shift", "id", shiftId.toString());
    }

    await this.dbService.shift.delete({
      where: { id: shiftId },
    });
  }
}