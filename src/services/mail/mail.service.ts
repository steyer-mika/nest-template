import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type User } from '@prisma/client';
import * as nodemailer from 'nodemailer';

import endpoints from '@/config/endpoints';
import { templateConfig } from './template.config';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        host: configService.get<string>('smtp.host'),
        port: configService.get<number>('smtp.port'),
        secure: true,
        auth: {
          user: configService.get<string>('smtp.user'),
          pass: configService.get<string>('smtp.password'),
        },
      },
      {
        from: `"No Reply" <${configService.get<string>('smtp.default')}>`,
      },
    );
  }

  async sendUserConfirmation(user: User, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('frontend');
    const appName = this.configService.get<string>('app.name');

    const url = `${frontendUrl}${endpoints.emailConfirm}?token=${token}`;

    await this.transporter.sendMail({
      to: user.email,
      subject: `Welcome to ${appName}! Confirm your Email`,
      html: templateConfig['confirmation']({
        name: user.email,
        url,
      }),
    });
  }

  async sendUserPasswordReset(user: User, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('frontend');
    const appName = this.configService.get<string>('app.name');

    const url = `${frontendUrl}${endpoints.resetPassword}?token=${token}`;

    await this.transporter.sendMail({
      to: user.email,
      subject: `<${appName}> Reset your password.`,
      html: templateConfig['reset-password']({
        name: user.email,
        url,
      }),
    });
  }
}
