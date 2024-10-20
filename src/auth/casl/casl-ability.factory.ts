import { AbilityBuilder, type PureAbility } from '@casl/ability';
import {
  createPrismaAbility,
  type PrismaQuery,
  type Subjects,
} from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { type User } from '@prisma/client';

import { type UserDto } from '@/api/user/dto/user.dto';

export const AppAction = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
} as const;

export type AppAction = (typeof AppAction)[keyof typeof AppAction];

export type AppSubjects = Subjects<{
  User: User;
}>;

export type AppAbility = PureAbility<
  [AppAction | 'manage', AppSubjects | 'all'],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDto) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user.role === 'Admin') {
      can('manage', 'all');
    } else if (user.role === 'User') {
      can('read', 'User'); // Allow the user to read their own account.
      can('update', 'User'); // Allow the user to update their own account.
      can('delete', 'User'); // Allow the user to delete their own account.
    }

    return build();
  }
}
