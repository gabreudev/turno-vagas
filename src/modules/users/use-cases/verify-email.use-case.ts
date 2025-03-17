import { env } from '@/common/env';
import { BadRequestError } from '@/common/errors/bad-request-error';
import type { DbService } from '@/modules/db/db.service';
import type { JwtService } from '@/modules/jwt/jwt.service';
import type { UsersService } from '../users.service';
import type { UserWithoutPasswordDto } from '@/common/validations/users/user.dto';
import { BaseError } from '@/common/errors/base-error';

interface JwtPayload {
  email: string;
}

export class VerifyEmailUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbService: DbService,
    private readonly usersService: UsersService,
  ) {}

  async execute(token: string): Promise<void> {
    const email = this.extractEmailFromToken(token);

    const user = await this.updateEmailVerification(email);

    await this.notifyAdmins(user.email, user.name);
  }

  private extractEmailFromToken(token: string): string {
    try {
      const payload = this.jwtService.verify(
        token,
        env.JWT_SECRET,
      ) as JwtPayload;
      if (!payload?.email) {
        throw new BadRequestError('Invalid token payload');
      }
      return payload.email;
    } catch (error) {
      console.error('JWT Verification Error:', error);
      throw new BadRequestError('Invalid token');
    }
  }

  private async updateEmailVerification(
    email: string,
  ): Promise<UserWithoutPasswordDto> {
    try {
      return await this.dbService.user.update({
        where: { email },
        data: { isEmailVerified: true },
        omit: {
          password: true,
        },
      });
    } catch (error) {
      console.error('Database Update Error:', error);
      throw new BaseError('Failed to verify email');
    }
  }

  private async notifyAdmins(email: string, name: string): Promise<void> {
    try {
      await this.usersService.sendVerifyEmailForAdmins(email, name);
    } catch (error) {
      console.error('Email Notification Error:', error);
      throw new BadRequestError('Error sending verification email');
    }
  }
}
