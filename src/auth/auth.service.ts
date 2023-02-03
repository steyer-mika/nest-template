import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@api/users/users.service';
import { User } from '@api/users/schemas/user.schema';
import { UserDto } from '@api/users/dto/user.dto';
import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { MailService } from '@/mail/mail.service';

import { JwtAuthResponse, AuthPayload } from './jwt/types';
import { JwtTokenType } from './jwt/enums';
import { plainToInstance } from 'class-transformer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailDto } from './dto/email.dto';

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

    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }

    return null;
  }

  async register(createUserDto: CreateUserDto): Promise<JwtAuthResponse> {
    const registeredUser = await this.usersService.create(createUserDto);
    this.sendEmailVerification(registeredUser);
    return this.login(registeredUser);
  }

  async sendEmailVerification(user: UserDto): Promise<string> {
    const confirmationPayload: AuthPayload = {
      email: user.email,
      role: user.role,
      sub: user.id,
      type: JwtTokenType.Confirmation,
    };

    const confirmationOptions: Partial<JwtSignOptions> = {
      expiresIn: this.configService.get<string>(
        'auth.jwt.confirmationExpiresIn',
      ),
    };

    const token = await this.jwtService.signAsync(
      confirmationPayload,
      confirmationOptions,
    );

    await this.mailService.sendUserConfirmation(user, token);

    return `Email verification send to user with id ${user.id}`;
  }

  async login(user: UserDto): Promise<JwtAuthResponse> {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessPayload: AuthPayload = {
      ...payload,
      type: JwtTokenType.Access,
    };

    const refreshPayload: AuthPayload = {
      ...payload,
      type: JwtTokenType.Refresh,
    };

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
    const payload: AuthPayload = await this.jwtService.verifyAsync(token);

    if (payload.type !== JwtTokenType.Confirmation) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.verifyEmail(payload.sub);
    return this.login(user);
  }

  async sendResetPassword(emailDto: EmailDto): Promise<string> {
    const userModel = await this.usersService.findByEmail(emailDto.email);
    const user = plainToInstance(UserDto, userModel);

    if (!user || !user.active) {
      throw new UnauthorizedException();
    }

    const resetPasswordPayload: AuthPayload = {
      email: user.email,
      role: user.role,
      sub: user.id,
      type: JwtTokenType.ResetPassword,
    };

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
  }
}
