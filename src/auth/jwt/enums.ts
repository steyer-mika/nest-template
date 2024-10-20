export const JwtTokenType = {
  Access: 'Access',
  Refresh: 'Refresh',
  Confirmation: 'Confirmation',
  ResetPassword: 'ResetPassword',
} as const;

export type JwtTokenType = (typeof JwtTokenType)[keyof typeof JwtTokenType];
