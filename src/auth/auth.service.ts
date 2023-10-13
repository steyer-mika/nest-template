import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import bcrypt from 'bcrypt';

import { type CreateUserDto } from '@/api/user/dto/create-user.dto';
import { UserDto } from '@/api/user/dto/user.dto';
import { MailService } from '@/services/mail/mail.service';
import { PrismaService } from '@/services/prisma/prisma.service';
import { UserService } from '@/api/user/user.service';

import { jwtOptionExpiresInFactory, tokenFactory } from './jwt/utility';
import { JwtTokenType } from './jwt/enums';
import { type AuthPayload, type JwtAuthResponse } from './jwt/types';
import { type ResetPasswordDto } from './dto/reset-password.dto';
import { type EmailDto } from './dto/email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user === null) return null;

    const isSamePassword = await bcrypt.compare(pass, user.password);
    return isSamePassword ? plainToInstance(UserDto, user) : null;
  }

  async register(createUserDto: CreateUserDto): Promise<JwtAuthResponse> {
    const registeredUser = await this.userService.create(createUserDto);
    this.sendEmailVerification(registeredUser);
    return this.login(registeredUser);
  }

  async sendEmailVerification(user: UserDto): Promise<string> {
    const expiresIn = this.configService.getOrThrow<string>(
      'auth.jwt.confirmationExpiresIn',
    );

    const payload = tokenFactory(user, 'Confirmation');
    const options = jwtOptionExpiresInFactory(expiresIn);

    const token = await this.jwtService.signAsync(payload, options);

    await this.mailService.sendUserEmailVerification(user, token);
    return `Email verification send to user with id ${user.id}`;
  }

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

  async sendResetPassword(emailDto: EmailDto): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email: emailDto.email },
    });

    if (!user || !user.active) {
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

    return `Reset password email send to user with id ${userDto.id}`;
  }

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
