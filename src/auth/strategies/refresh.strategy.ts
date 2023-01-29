import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '@api/users/users.service';
import { UserDto } from '@api/users/dto/user.dto';

import { LoginTokenPayload } from '../jwt/types';
import { JwtTokenType } from '../jwt/enums';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret'),
    });
  }

  async validate(payload: LoginTokenPayload): Promise<UserDto> {
    if (payload.type !== JwtTokenType.Refresh) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getUserById(payload.sub);

    if (!user || user.active !== true) throw new UnauthorizedException();
    return user;
  }
}
