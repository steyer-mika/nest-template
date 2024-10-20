import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { type CreateUserDto } from '@/api/user/dto/create-user.dto';
import { UserDto } from '@/api/user/dto/user.dto';
import { UserService } from '@/api/user/user.service';
import { MailService } from '@/services/mail/mail.service';
import { PrismaService } from '@/services/prisma/prisma.service';

import { type EmailDto } from './dto/email.dto';
import { type ResetPasswordDto } from './dto/reset-password.dto';
import { JwtTokenType } from './jwt/enums';
import { type AuthPayload, type JwtAuthResponse } from './jwt/types';
import { jwtOptionExpiresInFactory, tokenFactory } from './jwt/utility';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Validate a user's email and password during login.
   * @param email - The user's email.
   * @param pass - The user's password.
   * @returns A UserDto or null if validation fails.
   */
  async validateUser(email: string, pass: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user === null) return null;

    const isSamePassword = await bcrypt.compare(pass, user.password);
    return isSamePassword ? plainToInstance(UserDto, user) : null;
  }

  /**
   * Register a new user, send email verification, and log in.
   * @param createUserDto - Data for creating a new user.
   * @returns A JWT authentication response.
   */
  async register(createUserDto: CreateUserDto): Promise<JwtAuthResponse> {
    const registeredUser = await this.userService.create(createUserDto);
    this.sendEmailVerification(registeredUser);
    return this.login(registeredUser);
  }

  /**
   * Send an email for email verification.
   * @param user - The user to send the email verification to.
   * @returns A message indicating the success of the email verification request.
   */
  async sendEmailVerification(user: UserDto): Promise<string> {
    const expiresIn = this.configService.getOrThrow<string>(
      'auth.jwt.confirmationExpiresIn',
    );

    const payload = tokenFactory(user, 'Confirmation');
    const options = jwtOptionExpiresInFactory(expiresIn);

    const token = await this.jwtService.signAsync(payload, options);

    await this.mailService.sendUserEmailVerification(user, token);
    return `Email verification sent to user with id ${user.id}`;
  }

  /**
   * Log in a user.
   * @param user - The user to log in.
   * @returns A JWT authentication response.
   */
  async login(user: UserDto): Promise<JwtAuthResponse> {
    const accessPayload = tokenFactory(user, 'Access');
    const refreshPayload = tokenFactory(user, 'Refresh');

    const refreshOptions: Partial<JwtSignOptions> = {
      expiresIn: this.configService.get<string>('auth.jwt.refreshExpiresIn'),
    };

    return {
      user,
      accessToken: await this.jwtService.signAsync(accessPayload),
      refreshToken: await this.jwtService.signAsync(
        refreshPayload,
        refreshOptions,
      ),
    };
  }

  /**
   * Verify a user's email using a token.
   * @param token - The email verification token.
   * @returns A JWT authentication response.
   */
  async verifyEmail(token: string): Promise<JwtAuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(token);

      if (payload.type !== JwtTokenType.Confirmation) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.verifyEmail(payload.sub);
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  /**
   * Send an email for resetting the user's password.
   * @param emailDto - Data containing the user's email for password reset.
   * @returns A message indicating the success of the email reset request.
   */
  async sendResetPassword(emailDto: EmailDto): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email: emailDto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    const userDto = plainToInstance(UserDto, user);

    const resetPasswordPayload = tokenFactory(userDto, 'ResetPassword');

    const resetPasswordOptions: Partial<JwtSignOptions> = {
      expiresIn: this.configService.get<string>(
        'auth.jwt.resetPasswordExpiresIn',
      ),
    };

    const token = await this.jwtService.signAsync(
      resetPasswordPayload,
      resetPasswordOptions,
    );

    await this.mailService.sendUserPasswordReset(userDto, token);

    return `Reset password email sent to user with id ${userDto.id}`;
  }

  /**
   * Reset a user's password using a token.
   * @param resetPasswordDto - Data containing the password reset token and new password.
   * @returns A JWT authentication response.
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<JwtAuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(
        resetPasswordDto.password,
      );

      if (payload.type !== JwtTokenType.Confirmation) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.resetPassword(
        payload.sub,
        resetPasswordDto.password,
      );

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
