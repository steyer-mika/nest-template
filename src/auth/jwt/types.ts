import { UserDto } from '@api/users/dto/user.dto';

import { JwtTokenType } from './enums';

type JwtToken = {
  iat: number;
  exp: number;
};

export type AuthPayload = {
  sub: string;
  email: string;
  role: string;
  type: JwtTokenType;
};

export type LoginTokenPayload = JwtToken & AuthPayload;

export type JwtAuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
};
