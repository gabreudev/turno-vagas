import type { CreateUserResponseDto } from '@/common/validations/users/create-user/create-user-response.dto';
import type { GetUsersUseCase } from './use-cases/get-users.use-case';
import type { GetUsersResponseDto } from '@/common/validations/users/get-users/get-users-response.dto';
import type { CreateUserUseCase } from './use-cases/create-user.use-case';
import type { CreateUserRequestDto } from '@/common/validations/users/create-user/create-user-request.dto';
import type { UpdateUserUseCase } from './use-cases/update-user.use-case';
import type { UpdateUserRequestDto } from '@/common/validations/users/update-user/update-user-request.dto';
import { updateUserRequestSchema } from '@/common/validations/users/update-user/update-user-request.dto';
import type { UpdateUserResponseDto } from '@/common/validations/users/update-user/update-user-response.dto';
import { z } from 'zod';
import type { UsersService } from './users.service';
import type { VerifyEmailUseCase } from './use-cases/verify-email.use-case';

// TODO: Centralize sanitation

export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  async createUser(
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const createdUser =
      await this.createUserUseCase.execute(createUserRequestDto);

    await this.usersService.sendVerifyEmail(
      createdUser.email,
      createdUser.name,
    );

    return createdUser;
  }

  async verifyEmail(token: string): Promise<void> {
    return this.verifyEmailUseCase.execute(token);
  }

  async getUsers(): Promise<GetUsersResponseDto> {
    return this.getUsersUseCase.execute();
  }

  async updateUser(
    id: number,
    updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return this.updateUserUseCase.execute(
      z.number().parse(id),
      updateUserRequestSchema.parse(updateUserRequestDto),
    );
  }
}
