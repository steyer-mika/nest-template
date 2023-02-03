import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '@api/users/users.service';
import { UserDto } from '@api/users/dto/user.dto';

import { LoginTokenPayload } from '../jwt/types';
import { JwtTokenType } from '../jwt/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret'),
    });
  }

  async validate(payload: LoginTokenPayload): Promise<UserDto> {
    if (payload.type !== JwtTokenType.Access) throw new UnauthorizedException();

    const user = await this.usersService.find(payload.sub, false);

    if (!user || user.active !== true) throw new UnauthorizedException();
    return user;
  }
}
