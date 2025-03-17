import { roleSchema } from '@/common/validations/users/user.dto';
import type { HashService } from '@/modules/hash/hash.service';
import type { UsersService } from '@/modules/users/users.service';
import { UnauthorizedError } from '@/common/errors/unauthorized-error';
import { ForbiddenError } from '@/common/errors/forbidden-error';
import type { JwtService } from '@/modules/jwt/jwt.service';
import { EXPIRES_IN } from '@/common/constants/token';
import { env } from '@/common/env';
import type { LoginResponseDto } from '@/common/validations/auth/login/login-response.dto';
import type { LoginRequestDto } from '@/common/validations/auth/login/login-request.dto';

export class LoginUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersService.getByEmail(email);

    const isPasswordCorrect = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Incorrect password');
    }

    if (!user.isEmailVerified) {
      this.usersService.sendVerifyEmail(user.email, user.name)

      throw new ForbiddenError('Email not verified');
    }

    if (user.isBanned) {
      throw new ForbiddenError(
        `Unable to login, please contact your ${roleSchema.enum.ADMINISTRADOR}`,
      );
    }

    const userWithoutPassword = { ...user, password: undefined };

    return {
      token: this.jwtService.sign(userWithoutPassword, env.JWT_SECRET, {
        expiresIn: EXPIRES_IN,
      }),
    };
  }
}
