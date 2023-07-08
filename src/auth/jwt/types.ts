import { User } from '@prisma/client';

import { JwtTokenType } from './enums';

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

export type LoginTokenPayload = JwtToken & AuthPayload;

export type JwtAuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
