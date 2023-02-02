import { applyDecorators } from '@nestjs/common';
import { CheckPolicies } from '@auth/decorators/polices.decorator';
import { AppAbility } from '@/auth/casl/casl-ability.factory';
import { Action } from '@/auth/casl/actions';

type ActionLiteral = keyof typeof Action;

type ActionType<TType> = TType extends 'Manage' ? never : TType;

export const Authorization = (
  action: ActionType<ActionLiteral>,
  schema: unknown,
) => {
  return applyDecorators(
    CheckPolicies((ability: AppAbility) => ability.can(Action[action], schema)),
  );
};
