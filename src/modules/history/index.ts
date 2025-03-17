import { dbService } from '../db';
import { getShiftsUseCase } from '../shifts';
import { HistorysController as HistoriesController } from './historys.controller';
import { HistoriesService } from './historys.service';
import { GetHistoryUseCase } from './use-cases/get-historys.usecase';
import { UpdateHistoryUseCase } from './use-cases/update-history.use-case';

const historiesService = new HistoriesService(dbService, getShiftsUseCase);

const getHistoryUseCase = new GetHistoryUseCase(dbService);
const updateHistoryUseCase = new UpdateHistoryUseCase(dbService);

const historiescontroller = new HistoriesController(
  historiesService,
  getHistoryUseCase,
  updateHistoryUseCase,
);

export { historiesService, historiescontroller as historiescontroller };
