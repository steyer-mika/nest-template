import { Exclude, Expose, Transform } from 'class-transformer';
import { Roles } from '@auth/roles';

@Exclude()
export class UserDto {
  @Transform(({ obj }) => obj._id.toString())
  @Expose({ name: '_id' })
  readonly id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: Roles;

  password: string;
}
