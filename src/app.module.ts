import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

import { ApiModule } from '@/api/api.module';
import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '@/auth/guards/policies.guard';
import environment from '@/config/environment';
import { LoggerMiddleware } from '@/core/middleware/logger.middleware';
import { validateEnvironmentVariables } from '@/core/validation/environment';
import { HealthModule } from '@/services/health/health.module';
import { MailModule } from '@/services/mail/mail.module';
import { PrismaModule } from '@/services/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironmentVariables,
      load: [environment],
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('cache.ttl'),
        limit: configService.get<number>('cache.limit'),
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client'),
      serveStaticOptions: {
        fallthrough: false,
        redirect: false,
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>('throttler.ttl'),
          limit: configService.getOrThrow<number>('throttler.limit'),
        },
      ],
    }),

    HealthModule,
    AuthModule,
    ApiModule,
    MailModule,
    PrismaModule,
    ApiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('api/*');
  }
}
