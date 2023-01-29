import { Exclude, Expose, Transform } from 'class-transformer';
import { Roles } from '@auth/roles';
import { ApiHideProperty } from '@nestjs/swagger';

@Exclude()
export class UserDto {
  @Transform(({ obj }) => obj._id.toString())
  @Expose({ name: '_id' })
  readonly id: string;

  @Expose()
  readonly username: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly role: Roles;

  @ApiHideProperty()
  readonly password: string;

  @Expose()
  readonly active: boolean;
}
