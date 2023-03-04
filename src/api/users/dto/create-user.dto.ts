import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

import { IsPassword } from '@/core/decorators/validation/isPassword.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsPassword()
  readonly password: string;

  @ApiProperty({ enum: Object.values(Role) })
  @IsEnum(Role)
  readonly role: Role;
}
