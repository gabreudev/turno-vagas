import type { CreateShiftRequestDto } from '@/common/validations/shift/create-shift/create-shift-request.dto';
import type { CreateShiftResponseDto } from '@/common/validations/shift/create-shift/create-shift.reponse.dto';
import type { GetShiftsResponseDto } from '@/common/validations/shift/get-shift/get-shifts-response.dto';
import type { UpdateShiftResponseDto } from '@/common/validations/shift/shift.dto';
import type { UpdateShiftRequestDto } from '@/common/validations/shift/update-shifts/update-shift-request.dto';
import { updateShiftRequestSchema } from '@/common/validations/shift/update-shifts/update-shift-request.dto';
import { z } from 'zod';
import type { CreateShiftUseCase } from './use-cases/create-shift.use-case';
import type { DeleteShiftUseCase } from './use-cases/delete-shift.use-case';
import type { GetShiftsByUserUseCase } from './use-cases/get-shifts-by-user.use-case';
import type { GetShiftsUseCase } from './use-cases/get-shifts.use-case';
import type { UpdateShiftUseCase } from './use-cases/update-shift.use-case';

export class ShiftsController {
  constructor(
    private readonly createShiftUseCase: CreateShiftUseCase,
    private readonly getShiftsUseCase: GetShiftsUseCase,
    private readonly getShiftsByUserUseCase: GetShiftsByUserUseCase,
    private readonly updateShiftUseCase: UpdateShiftUseCase,
    private readonly deleteShiftUseCase: DeleteShiftUseCase,
  ) {}

  async createShift(
    createShiftRequestDto: CreateShiftRequestDto,
  ): Promise<CreateShiftResponseDto> {
    return this.createShiftUseCase.execute(createShiftRequestDto);
  }

  async getShifts(): Promise<GetShiftsResponseDto> {
    return this.getShiftsUseCase.execute();
  }

  async getShiftsByUser(id: number): Promise<GetShiftsResponseDto> {
    return this.getShiftsByUserUseCase.execute(z.number().parse(id));
  }

  async updateShift(
    id: number,
    updateShiftRequestDto: UpdateShiftRequestDto,
  ): Promise<UpdateShiftResponseDto> {
    return this.updateShiftUseCase.execute(
      z.number().parse(id),
      updateShiftRequestSchema.parse(updateShiftRequestDto),
    );
  }
  async deleteShift(id: number): Promise<void> {
    return this.deleteShiftUseCase.execute(z.number().parse(id));
  }
}
