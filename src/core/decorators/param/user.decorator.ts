import { type UserDto } from '@/api/user/dto/user.dto';
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): UserDto | undefined => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
