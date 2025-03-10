import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type LibraryResponse, Client } from 'node-mailjet';
import type { RequestData } from 'node-mailjet/declarations/request/Request';

import { type UserDto } from '@/api/user/dto/user.dto';
import { extractUserCredentials } from '@/api/user/utility/extract-user-credentials';
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

  /**
   * Send an email for email verification.
   * @param user - The user to send the email verification to.
   * @param jwtToken - JWT token for email verification.
   * @returns A promise with the result of sending the email.
   */
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

  /**
   * Send an email for resetting the user's password.
   * @param user - The user to send the password reset email to.
   * @param jwtToken - JWT token for password reset.
   * @returns A promise with the result of sending the email.
   */
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
