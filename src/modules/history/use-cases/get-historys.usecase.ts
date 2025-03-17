import type { GetHistoryResponseDto } from '@/common/validations/history/get-history/get-history-response.dto';
import type { DbService } from '@/modules/db/db.service';

export class GetHistoryUseCase {
  constructor(private readonly dbService: DbService) {}

  async execute(): Promise<GetHistoryResponseDto> {
    const historys = await this.dbService.history.findMany();
    return historys;
  }
}
