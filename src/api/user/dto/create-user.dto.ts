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
  readonly firstName?: string | undefined;

  @IsOptional()
  @IsString()
  readonly lastName?: string | undefined;
}
