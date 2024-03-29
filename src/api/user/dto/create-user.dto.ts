import { IsEmail, IsOptional, IsString } from 'class-validator';
import { type User } from '@prisma/client';

import { IsPassword } from '@/core/decorators/validation/isPassword.decorator';

export class CreateUserDto implements Partial<User> {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly username: string;

  @IsPassword()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly firstname?: string | undefined;

  @IsOptional()
  @IsString()
  readonly lastname?: string | undefined;

  @IsOptional()
  @IsString()
  readonly locale?: string | undefined;
}
