import { hashService } from '../hash';
import { jwtService } from '../jwt';
import { usersService } from '../users';
import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
import { LoginUseCase } from './use-cases/login.use-case';

// const authService = new AuthService();

const loginUseCase = new LoginUseCase(usersService, hashService, jwtService);

const authController = new AuthController(loginUseCase);

export { authController };
