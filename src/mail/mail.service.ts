import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { UserDto } from '@api/users/dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(user: UserDto, token: string) {
    const frontendUrl = this.configService.get<string>('frontend');
    const appName = this.configService.get<string>('app.name');

    const url = `${frontendUrl}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `'Welcome to ${appName}! Confirm your Email'`,
      template: './confirmation',
      context: {
        name: user.username,
        url,
      },
    });
  }
}
