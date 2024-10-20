import { type User } from '@prisma/client';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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
  @MinLength(1)
  readonly firstname?: string | undefined;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly lastname?: string | undefined;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly locale?: string | undefined;
}
