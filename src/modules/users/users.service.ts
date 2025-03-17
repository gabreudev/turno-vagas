import { env } from '@/common/env';
import { NotFoundError } from '@/common/errors/not-found-error';
import type { UserDto } from '@/common/validations/users/user.dto';
import { Role } from '@prisma/client';
import type { DbService } from '../db/db.service';
import type { EmailService } from '../email/email.service';
import { generateApprovalNotificationEmail } from '../email/templates/generate-aproval-notification-email';
import { generateVerifyEmail } from '../email/templates/generate-verify-email';
import { generateVerifyEmailForAdmins } from '../email/templates/generate-verify-email-for-admins';
import type { JwtService } from '../jwt/jwt.service';

export class UsersService {
  constructor(
    private readonly dbService: DbService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async getByEmail(email: string): Promise<UserDto> {
    const user = await this.dbService.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundError('User', 'email', email);
    }

    return user;
  }

  async sendVerifyEmail(email: string, name: string): Promise<void> {
    const token = await this.generateVerifyEmailToken(email);

    await this.emailService.sendEmail({
      to: email,
      subject: 'Turno Vagas - Verifique seu email',
      html: generateVerifyEmail(
        name,
        `${env.FE_VERIFICATION_EMAIL_PATH}${token}`,
      ),
    });
  }

  async sendApprovalEmail(email: string, name: string): Promise<void> {
    await this.emailService.sendEmail({
      to: email,
      subject: 'Turno Vagas - Seu registro foi aprovado',
      html: generateApprovalNotificationEmail(name, `${env.BASE_URL}`),
    });
  }

  async sendVerifyEmailForAdmins(email: string, name: string): Promise<void> {
    const admins = await this.dbService.user.findMany({
      where: {
        role: Role.ADMINISTRADOR,
        isBanned: false,
      },
    });

    await Promise.all(
      admins.map((admin) =>
        this.emailService.sendEmail({
          to: admin.email,
          subject: 'Turno Vagas - Novo usuário precisa ser aprovado',
          html: generateVerifyEmailForAdmins(
            name,
            email,
            `${env.BASE_URL}/administrador/usuarios`,
          ),
        }),
      ),
    );
  }

  private async generateVerifyEmailToken(email: string): Promise<string> {
    return this.jwtService.sign({ email }, env.JWT_SECRET, { expiresIn: '1h' });
  }
}
