import { IsJWT } from 'class-validator';

import { Match } from '@/core/decorators/validation/match.decorator';
import { IsPassword } from '@/core/decorators/validation/isPassword.decorator';

export class ResetPasswordDto {
  @IsJWT()
  readonly token: string;

  @IsPassword()
  readonly password: string;

  @Match('password')
  readonly passwordConfirm: string;
}
