import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@api/users/users.service';
import { User } from '@api/users/schemas/user.schema';
import { UserDto } from '@api/users/dto/user.dto';
import { CreateUserDto } from '@api/users/dto/create-user.dto';

import { JwtAuthResponse, AuthPayload } from './jwt/types';
import { JwtTokenType } from './jwt/enums';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    return this.login(registeredUser);
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
}
