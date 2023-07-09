import { applyDecorators } from '@nestjs/common';
import { CheckPolicies } from '@auth/decorators/polices.decorator';
import {
  type AppAbility,
  type AppSubjects,
} from '@/auth/casl/casl-ability.factory';
import { Action } from '@/auth/casl/actions';

type ActionLiteral = keyof typeof Action;

type ActionType<TType> = TType extends Action.Manage ? never : TType;

export const Authorization = (
  action: ActionType<ActionLiteral>,
  ...subjects: AppSubjects[]
) => {
  return applyDecorators(
    CheckPolicies((ability: AppAbility) =>
      Boolean(
        subjects.find(
          (subject) => ability.can(Action[action], subject) === true,
        ),
      ),
    ),
  );
};
