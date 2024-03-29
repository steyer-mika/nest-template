import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

import { type LoginTokenPayload } from '@/auth/jwt/types';
import { JwtTokenType } from '@/auth/jwt/enums';
import { PrismaService } from '@/services/prisma/prisma.service';
import { UserDto } from '@/api/user/dto/user.dto';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    readonly configService: ConfigService,
    private readonly prisma: PrismaService,
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

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user || user.active !== true) throw new UnauthorizedException();

    return plainToInstance(UserDto, user);
  }
}
