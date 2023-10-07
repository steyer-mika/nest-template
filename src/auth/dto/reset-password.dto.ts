import { IsPassword } from '@/core/decorators/validation/isPassword.decorator';

import { TokenDto } from './token.dto';

export class ResetPasswordDto extends TokenDto {
  @IsPassword()
  readonly password: string;
}
