import { type Role, type User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto implements User {
  @Expose()
  readonly id: number;

  @Expose()
  readonly email: string;

  @Expose()
  readonly role: Role;

  readonly password: string;

  @Expose()
  readonly username: string;

  @Expose()
  readonly firstName: string | null;

  @Expose()
  readonly lastName: string | null;

  @Expose()
  readonly active: boolean;

  @Expose()
  readonly emailVerified: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}
