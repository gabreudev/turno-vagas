import type { Transporter } from 'nodemailer';
import type { Address } from 'nodemailer/lib/mailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';
import nodemailer from 'nodemailer';
import { env } from '@/common/env';

export class EmailService {
  private readonly transporter: Transporter;
  private readonly emailFrom: Address;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_IS_SECURE,
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    });

    this.emailFrom = {
      name: env.EMAIL_FROM_NAME || 'Turno-Vagas',
      address: env.EMAIL_USER,
    };
  }

  public async sendEmail(
    mailOptions: MailOptions & {
      to: string | Address | Array<string | Address>;
      subject: string;
    } & ({ text: string } | { html: string }),
  ): Promise<void> {
    try {
      return await this.transporter.sendMail({
        ...mailOptions,
        from: this.emailFrom,
      });
    } catch (error: unknown) {
      const err = error as Error;

      // TODO: We need to be informed about this error
      console.error(
        `erro ao enviar e-mail para ${mailOptions.to}: ${err.message}`,
      );
    }
  }
}
