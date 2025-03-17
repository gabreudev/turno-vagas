import type { LoginResponseDto } from '@/common/validations/auth/login/login-response.dto';
import type { LoginUseCase } from './use-cases/login.use-case';
import type { LoginRequestDto } from '@/common/validations/auth/login/login-request.dto';
import { loginRequestSchema } from '@/common/validations/auth/login/login-request.dto';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(loginRequestSchema.parse(loginRequestDto));
  }
}
