import { IsJWT } from 'class-validator';

import { IsPassword } from '@/core/decorators/validation/isPassword.decorator';

export class ResetPasswordDto {
  @IsJWT()
  readonly token: string;

  @IsPassword()
  readonly password: string;
}
