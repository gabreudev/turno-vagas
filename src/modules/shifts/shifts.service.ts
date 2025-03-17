import { Role } from '@prisma/client';
import { env } from 'process';
import type { DbService } from '../db/db.service';
import type { EmailService } from '../email/email.service';
import { genererateApprovedShiftNotificationEmail } from '../email/templates/generate-approved-shift-notification-email';
import { generateNewShiftNotificationEmail } from '../email/templates/generate-new-shift-notification-email';
import { genererateRejectedShiftNotificationEmail } from '../email/templates/generate-rejected-shift-notification-email';

export class ShiftsService {
  constructor(
    private readonly dbService: DbService,
    private readonly emailService: EmailService,
  ) {}
  async sendApprovedShiftNotification(
    email: string,
    name: string,
    weekDay: string,
    startAt: string,
    endAt: string,
  ): Promise<void> {
    await this.emailService.sendEmail({
      to: email,
      subject: 'Turno Vagas - Turno aprovado',
      html: genererateApprovedShiftNotificationEmail(
        name,
        email,
        weekDay,
        startAt,
        endAt,
        `${env.BASE_URL}`,
      ),
    });
  }

  async sendRejectedShiftNotification(
    email: string,
    name: string,
    weekDay: string,
    startAt: string,
    endAt: string,
  ): Promise<void> {
    await this.emailService.sendEmail({
      to: email,
      subject: 'Turno Vagas - Turno não aprovado',
      html: genererateRejectedShiftNotificationEmail(
        name,
        email,
        weekDay,
        startAt,
        endAt,
        `${env.BASE_URL}`,
      ),
    });
  }

  async sendApprovalShiftForAdmins(
    email: string,
    name: string,
    weekDay: string,
    startAt: string,
    endAt: string,
  ): Promise<void> {
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
          subject: 'Turno Vagas - Novo turno cadastrado',
          html: generateNewShiftNotificationEmail(
            name,
            email,
            weekDay,
            startAt,
            endAt,
            `${env.BASE_URL}`,
          ),
        }),
      ),
    );
  }
}
