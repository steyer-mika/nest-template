import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { type Reflector } from '@nestjs/core';

import { type UserDto } from '@/api/user/dto/user.dto';
import {
  type AppAbility,
  type CaslAbilityFactory,
} from '@/auth/casl/casl-ability.factory';
import {
  CHECK_POLICIES_KEY,
  type PolicyHandler,
} from '@/auth/decorators/polices.decorator';
import { IS_PUBLIC_KEY } from '@/auth/decorators/public.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const user: UserDto = context.switchToHttp().getRequest().user;

    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }

    return handler.handle(ability);
  }
}
