import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@api/users/users.service';
import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { MailService } from '@/services/mail/mail.service';

import { JwtAuthResponse, AuthPayload } from './jwt/types';
import { JwtTokenType } from './jwt/enums';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailDto } from './dto/email.dto';
import { jwtOptionExpiresInFactory, tokenFactory } from './jwt/utility';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const compared = await bcrypt.compare(pass, user.password);
    return compared ? user : null;
  }

  async register(createUserDto: CreateUserDto): Promise<JwtAuthResponse> {
    const registeredUser = await this.usersService.create(createUserDto);
    this.sendEmailVerification(registeredUser);
    return this.login(registeredUser);
  }

  async sendEmailVerification(user: User): Promise<string> {
    const expiresIn = this.configService.get<string>(
      'auth.jwt.confirmationExpiresIn',
    );

    const payload = tokenFactory(user, 'Confirmation');
    const options = jwtOptionExpiresInFactory(expiresIn);

    const token = await this.jwtService.signAsync(payload, options);

    await this.mailService.sendUserConfirmation(user, token);
    return `Email verification send to user with id ${user.id}`;
  }

  async login(user: User): Promise<JwtAuthResponse> {
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
      const payload: AuthPayload = await this.jwtService.verifyAsync(token);
      if (payload.type !== JwtTokenType.Confirmation) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.verifyEmail(payload.sub);
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async sendResetPassword(emailDto: EmailDto): Promise<string> {
    const user = await this.usersService.findByEmail(emailDto.email);

    if (!user || !user.active) {
      throw new UnauthorizedException();
    }

    const resetPasswordPayload = tokenFactory(user, 'ResetPassword');

    const resetPasswordOptions: Partial<JwtSignOptions> = {
      expiresIn: this.configService.get<string>(
        'auth.jwt.resetPasswordExpiresIn',
      ),
    };

    const token = await this.jwtService.signAsync(
      resetPasswordPayload,
      resetPasswordOptions,
    );

    await this.mailService.sendUserPasswordReset(user, token);

    return `Reset password email send to user with id ${user.id}`;
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<JwtAuthResponse> {
    try {
      const payload: AuthPayload = await this.jwtService.verifyAsync(
        resetPasswordDto.password,
      );

      if (payload.type !== JwtTokenType.Confirmation) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.resetPassword(
        payload.sub,
        resetPasswordDto.password,
      );
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
