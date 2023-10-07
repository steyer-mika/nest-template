import { Injectable } from '@nestjs/common';
import { AbilityBuilder, type PureAbility } from '@casl/ability';
import {
  type Subjects,
  createPrismaAbility,
  type PrismaQuery,
} from '@casl/prisma';
import { type User, Role } from '@prisma/client';

import { Action } from './actions';

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
      can(Action.Read, 'User');
    }

    return build();
  }
}
