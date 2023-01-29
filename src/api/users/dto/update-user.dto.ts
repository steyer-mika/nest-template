import { IsNotEmpty, IsEnum, IsString, IsBoolean } from 'class-validator';

import { Roles } from '@auth/roles';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsEnum(Roles)
  readonly role: Roles;

  @IsBoolean()
  readonly active: boolean;
}
