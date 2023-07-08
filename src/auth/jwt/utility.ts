import { type JwtSignOptions } from '@nestjs/jwt';
import { type User } from '@prisma/client';

import { JwtTokenType } from './enums';
import { type AuthPayload } from './types';

export const tokenFactory = (
  user: User,
  type: keyof typeof JwtTokenType,
): AuthPayload => ({
  email: user.email,
  role: user.role,
  sub: user.id,
  type: JwtTokenType[type],
});

export const jwtOptionExpiresInFactory = (
  expiresIn: string,
): Partial<JwtSignOptions> => ({
  expiresIn,
});
