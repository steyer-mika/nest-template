import { type UserDto } from '@/api/user/dto/user.dto';

import { type JwtTokenType } from './enums';

type JwtToken = {
  iat: number;
  exp: number;
};

export type AuthPayload = {
  sub: number;
  email: string;
  role: string;
  type: JwtTokenType;
};

export type TokenPayload = JwtToken & AuthPayload;

/**
 * The response the user receives when they authenticate with JWT.
 */
export type JwtAuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
};
