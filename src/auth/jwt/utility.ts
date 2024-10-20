import { type JwtSignOptions } from '@nestjs/jwt';

import { type UserDto } from '@/api/user/dto/user.dto';

import { type JwtTokenType } from './enums';
import { type AuthPayload } from './types';

/**
 * Factory function to create a token payload.
 *
 * @param user The user to create the token for.
 * @param type The type of token to create.
 *
 * @returns The token payload.
 */
export const tokenFactory = (
  user: UserDto,
  type: JwtTokenType,
): AuthPayload => ({
  email: user.email,
  role: user.role,
  sub: user.id,
  type,
});

/**
 * Factory function to create JWT options.
 *
 * @param expiresIn The time the token is valid for.
 *
 * @returns The JWT options.
 */
export const jwtOptionExpiresInFactory = (
  expiresIn: string,
): Partial<JwtSignOptions> => ({
  expiresIn,
});
