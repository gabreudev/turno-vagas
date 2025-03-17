import { dbService } from '../db';
import { emailService } from '../email';
import { hashService } from '../hash';
import { jwtService } from '../jwt';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUsersUseCase } from './use-cases/get-users.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { VerifyEmailUseCase } from './use-cases/verify-email.use-case';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const usersService = new UsersService(dbService, emailService, jwtService);

const createUserUseCase = new CreateUserUseCase(dbService, hashService);
const verifyEmailUseCase = new VerifyEmailUseCase(jwtService, dbService, usersService);
const getUsersUseCase = new GetUsersUseCase(dbService);
const updateUserUseCase = new UpdateUserUseCase(dbService, usersService);

const usersController = new UsersController(
  usersService,
  createUserUseCase,
  verifyEmailUseCase,
  getUsersUseCase,
  updateUserUseCase,
);

export { usersService, usersController };
