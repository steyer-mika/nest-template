import { Role, User } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto implements User {
  @Expose()
  readonly id: number;

  @Expose()
  readonly email: string;

  @Expose()
  readonly emailVerified: boolean;

  @ApiHideProperty()
  readonly password: string;

  @ApiProperty({ enum: Object.values(Role) })
  @Expose()
  readonly role: Role;

  @Expose()
  readonly active: boolean;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;
}
