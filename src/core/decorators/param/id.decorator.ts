import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

import { mongooseId } from '@/utility/regex';

export const Id = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const id = request.params.id;

    if (id && mongooseId.test(id)) return id;

    throw new BadRequestException('Param id is not a valid mongoose Id.');
  },
);
