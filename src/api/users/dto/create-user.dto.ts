import { IsEmail, IsNotEmpty, IsEnum, IsString } from 'class-validator';

import { Roles } from '@auth/roles';
import { IsPassword } from 'src/core/decorators/validation/isPassword.decorator';
import { Match } from 'src/core/decorators/validation/match.decorator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsPassword()
  readonly password: string;

  @Match('password')
  readonly passwordConfirm: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsEnum(Roles)
  readonly role: Roles;
}
