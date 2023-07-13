import { type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { join } from 'path';

import environment from '@/config/environment';
import { LoggerMiddleware } from '@/core/middleware/logger.middleware';
import { PrismaModule } from '@/services/prisma/prisma.module';
import { UsersModule } from '@/api/users/users.module';
import { MailModule } from '@/services/mail/mail.module';
import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '@/auth/guards/policies.guard';
import { HealthModule } from '@/services/health/health.module';
import { validateEnvironmentVariables } from '@/core/validation/env.validation';

@Module({
  imports: [
    CacheModule.register(),

    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironmentVariables,
      load: [environment],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client'),
      serveStaticOptions: {
        fallthrough: false,
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('throttler.ttl'),
        limit: configService.get<number>('throttler.limit'),
      }),
    }),

    HealthModule,
    AuthModule,
    UsersModule,
    MailModule,
    PrismaModule,
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
