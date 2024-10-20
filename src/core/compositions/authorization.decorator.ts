import { applyDecorators } from '@nestjs/common';

import {
  type AppAbility,
  type AppAction,
  type AppSubjects,
} from '@/auth/casl/casl-ability.factory';
import { CheckPolicies } from '@/auth/decorators/polices.decorator';

export const Authorization = (
  action: AppAction,
  ...subjects: AppSubjects[]
) => {
  return applyDecorators(
    CheckPolicies((ability: AppAbility) =>
      Boolean(
        subjects.find((subject) => ability.can(action, subject) === true),
      ),
    ),
  );
};
