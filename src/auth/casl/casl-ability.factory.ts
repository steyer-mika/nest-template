import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  createMongoAbility,
  AnyAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Roles } from '@auth/roles';
import { User } from '@api/users/schemas/user.schema';

import { Action } from './actions';
import { UserDto } from '@api/users/dto/user.dto';

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = AnyAbility;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDto) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    if (user?.role === Roles.Admin) {
      can(Action.Manage, 'all');
    } else if (user?.role === Roles.User) {
      can(Action.Read, User);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
