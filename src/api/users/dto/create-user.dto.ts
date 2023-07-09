import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { IsPassword } from '@/core/decorators/validation/isPassword.decorator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsPassword()
  readonly password: string;

  @ApiProperty({ enum: Object.values(Role) })
  @IsEnum(Role)
  readonly role: Role;
}
