import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type User } from '@prisma/client';

import { UsersService } from '@api/users/users.service';
import { type LoginTokenPayload } from '@auth/jwt/types';
import { JwtTokenType } from '@auth/jwt/enums';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret'),
    });
  }

  async validate(payload: LoginTokenPayload): Promise<User> {
    if (payload.type !== JwtTokenType.Refresh) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(payload.sub);

    if (!user || user.active !== true) throw new UnauthorizedException();
    return user;
  }
}
