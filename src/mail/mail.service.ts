import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserDto } from '@api/users/dto/user.dto';
import endpoints from '@/config/endpoints';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(user: UserDto, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('frontend');
    const appName = this.configService.get<string>('app.name');

    const url = `${frontendUrl}${endpoints.emailConfirm}?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Welcome to ${appName}! Confirm your Email`,
      template: './confirmation',
      context: {
        name: user.email,
        url,
      },
    });
  }

  async sendUserPasswordReset(user: UserDto, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('frontend');
    const appName = this.configService.get<string>('app.name');

    const url = `${frontendUrl}${endpoints.resetPassword}?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `<${appName}> Reset your password.`,
      template: './reset-password',
      context: {
        name: user.email,
        url,
      },
    });
  }
}
