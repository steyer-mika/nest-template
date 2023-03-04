import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ enum: Object.values(Role) })
  @IsEnum(Role)
  readonly role?: Role;

  @IsBoolean()
  readonly active?: boolean;
}
