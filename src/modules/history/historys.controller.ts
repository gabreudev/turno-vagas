import type { GetHistoryResponseDto } from '@/common/validations/history/get-history/get-history-response.dto';
import type { UpdateHistoryResponseDto } from '@/common/validations/history/history.dto';
import {
  updateHistoryRequestSchema,
  type UpdateHistoryRequestDto,
} from '@/common/validations/history/update-history/update-history-request.dto';
import { z } from 'zod';
import type { GetHistoryUseCase } from './use-cases/get-historys.usecase';
import type { UpdateHistoryUseCase } from './use-cases/update-history.use-case';
import type { HistoriesService } from './historys.service';

export class HistorysController {
  constructor(
    private readonly historiesService: HistoriesService,
    private readonly getHistoryUseCase: GetHistoryUseCase,
    private readonly updateHistoryUseCase: UpdateHistoryUseCase,
  ) {}

  async getHistory(): Promise<GetHistoryResponseDto> {
    return this.getHistoryUseCase.execute();
  }

  async updateHistory(
    id: number,
    updateHistoryRequestDto: UpdateHistoryRequestDto,
  ): Promise<UpdateHistoryResponseDto> {
    return this.updateHistoryUseCase.execute(
      z.number().parse(id),
      updateHistoryRequestSchema.parse(updateHistoryRequestDto),
    );
  }

  async addShiftsToHistory(): Promise<void> {
    return this.historiesService.addShiftsToHistory();
  }
}
