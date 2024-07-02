import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpRequestWithUser } from '../types';
import { ApiJwtPayload } from '../../interface';

export const HttpUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ApiJwtPayload => {
    const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
