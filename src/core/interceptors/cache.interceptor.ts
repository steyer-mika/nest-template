import { CacheInterceptor as NestCacheInterceptor } from '@nestjs/cache-manager';
import { type CallHandler, type ExecutionContext } from '@nestjs/common';
import { type Observable } from 'rxjs';

export class CacheInterceptor extends NestCacheInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const isNoCache = Reflect.getMetadata('no-cache', context.getHandler());

    if (isNoCache) {
      return next.handle();
    }

    // Otherwise, apply the CacheInterceptor
    return super.intercept(context, next);
  }
}
