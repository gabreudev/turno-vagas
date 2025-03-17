import { dbService } from '../db';
import { emailService } from '../email';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { CreateShiftUseCase } from './use-cases/create-shift.use-case';
import { DeleteShiftUseCase } from './use-cases/delete-shift.use-case';
import { GetShiftsByUserUseCase } from './use-cases/get-shifts-by-user.use-case';
import { GetShiftsUseCase } from './use-cases/get-shifts.use-case';
import { UpdateShiftUseCase } from './use-cases/update-shift.use-case';

const shiftService = new ShiftsService(dbService, emailService);

const createShiftUseCase = new CreateShiftUseCase(dbService, shiftService);
const getShiftsUseCase = new GetShiftsUseCase(dbService);
const updateShiftUseCase = new UpdateShiftUseCase(dbService, shiftService);
const getShiftsByUserUseCase = new GetShiftsByUserUseCase(dbService);
const deleteShiftUseCase = new DeleteShiftUseCase(dbService);

const shiftsController = new ShiftsController(
  createShiftUseCase,
  getShiftsUseCase,
  getShiftsByUserUseCase,
  updateShiftUseCase,
  deleteShiftUseCase,
);

export { getShiftsUseCase, shiftsController };
