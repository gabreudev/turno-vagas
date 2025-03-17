import { ForbiddenError } from '@/common/errors/forbidden-error';
import { NotFoundError } from '@/common/errors/not-found-error';
import type { UpdateHistoryResponseDto } from '@/common/validations/history/history.dto';
import type { UpdateHistoryRequestDto } from '@/common/validations/history/update-history/update-history-request.dto';
import type { DbService } from '@/modules/db/db.service';

export class UpdateHistoryUseCase {
  constructor(private readonly dbService: DbService) {}

  async execute(
    id: number,
    data: UpdateHistoryRequestDto,
  ): Promise<UpdateHistoryResponseDto> {
    const history = await this.dbService.history.findUnique({ where: { id } });

    if (!history) {
      throw new NotFoundError('History', 'id', id.toString());
    }

    const now = new Date();
    const createdAt = new Date(history.createdAt);

    const diffHoras = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (diffHoras >= 24) {
      throw new ForbiddenError('Invalid time: 24 hours have passed');
    }

    const updated = await this.dbService.history.update({
      where: { id },
      data,
    });

    return updated;
  }
}
