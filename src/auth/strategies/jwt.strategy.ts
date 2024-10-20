import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserDto } from '@/api/user/dto/user.dto';
import { JwtTokenType } from '@/auth/jwt/enums';
import { type LoginTokenPayload } from '@/auth/jwt/types';
import { PrismaService } from '@/services/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret'),
    });
  }

  async validate(payload: LoginTokenPayload): Promise<UserDto> {
    if (payload.type !== JwtTokenType.Access) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.isActive !== true) throw new UnauthorizedException();

    return plainToInstance(UserDto, user);
  }
}
