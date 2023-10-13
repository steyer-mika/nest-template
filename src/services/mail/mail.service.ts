import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RequestData } from 'node-mailjet/declarations/request/Request';
import { type LibraryResponse, Client } from 'node-mailjet';

import { type UserDto } from '@/api/user/dto/user.dto';
import { extractUserCredentials } from '@/utility/user/extract-user-credentials';
import endpoints from '@/config/endpoints';
import mailjetConfig from '@/config/mailjet';

import type {
  ResetPasswordVariables,
  VerifyEmailVariables,
} from './email.interfaces';

@Injectable()
export class MailService {
  private readonly mailjet: Client;

  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.getOrThrow<string>('mail.key.public');
    const apiSecret = configService.getOrThrow<string>('mail.key.private');

    this.mailjet = new Client({
      apiKey,
      apiSecret,
    });
  }

  async sendUserEmailVerification(user: UserDto, jwtToken: string) {
    const userCredentials = extractUserCredentials(user);

    const frontendUrl = this.configService.get<string>('frontend.url');

    const variables: VerifyEmailVariables = {
      verifyEmailLink: `${frontendUrl}/${endpoints.emailConfirm}?token=${jwtToken}`,
    };

    return this.sendMail(
      mailjetConfig.templates.verifyEmail.id,
      mailjetConfig.templates.verifyEmail.subject,
      variables,
      user.email,
      userCredentials,
    );
  }

  async sendUserPasswordReset(user: UserDto, jwtToken: string) {
    const userCredentials = extractUserCredentials(user);

    const frontendUrl = this.configService.get<string>('frontend.url');

    const variables: ResetPasswordVariables = {
      resetPasswordLink: `${frontendUrl}/${endpoints.resetPassword}?token=${jwtToken}`,
    };

    return this.sendMail(
      mailjetConfig.templates.resetPassword.id,
      mailjetConfig.templates.resetPassword.subject,
      variables,
      user.email,
      userCredentials,
    );
  }

  private sendMail(
    templateId: number,
    subject: string,
    variables: Record<string, unknown>,
    emailTo: string,
    nameTo: string,
    attachments?: Iterable<Record<string, string>>,
    cc?: { Email: string; Name: string }[],
  ): Promise<LibraryResponse<RequestData>> {
    const env = this.configService.get<string>('env');

    if (env !== 'production' && env !== 'staging') {
      return Promise.reject(
        `${subject} Mail didn't fire because env is not production! Current ${env}.`,
      );
    }

    try {
      return this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: mailjetConfig.from,
              Name: mailjetConfig.name,
            },
            To: [
              {
                Email: emailTo,
                Name: nameTo,
              },
            ],
            TemplateID: templateId,
            TemplateLanguage: true,
            Subject: subject,
            Variables: variables,
            Attachments: attachments,
            Cc: cc,
          },
        ],
      });
    } catch (error) {
      this.logger.error(`Mail Service: ${error}`);
      return Promise.reject(error);
    }
  }
}
