import { AbilityBuilder, type PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import {
  type Subjects,
  createPrismaAbility,
  type PrismaQuery,
} from '@casl/prisma';

import { Action } from './actions';
import { type User, Role } from '@prisma/client';

export type AppSubjects = Subjects<{
  User: User;
}>;

export type AppAbility = PureAbility<
  [string, AppSubjects | 'all'],
  PrismaQuery
>;
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user.role === Role.Admin) {
      can(Action.Manage, 'all');
    } else if (user.role === Role.User) {
      can(Action.Manage, 'User');
    }

    return build();
  }
}
