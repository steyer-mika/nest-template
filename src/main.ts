import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import { type Environment } from '@/config/environment';
import { LoggerConfig } from '@/config/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerConfig.new(),
  });

  const config = app.get<ConfigService>(ConfigService);

  // https://docs.nestjs.com/techniques/compression //
  app.use(compression());

  // https://docs.nestjs.com/security/helmet //
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  // https://docs.nestjs.com/faq/global-prefix //
  app.setGlobalPrefix('api');

  // https://docs.nestjs.com/security/cors //
  app.enableCors({
    origin: config.getOrThrow<string>('frontend.url'),
    allowedHeaders: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // https://docs.nestjs.com/techniques/cookies //
  app.use(cookieParser());

  // https://docs.nestjs.com/techniques/validation //
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  if (config.getOrThrow<Environment>('env') === 'local') {
    // https://docs.nestjs.com/openapi/introduction //
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.getOrThrow<string>('app.name'))
      .setDescription(`${config.getOrThrow<string>('app.name')} API`)
      .setVersion(process.env.npm_package_version || '0.0.1')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document, {
      customfavIcon: 'favicon.ico',
    });
  }

  await app.listen(config.getOrThrow<number>('app.port'));
}
bootstrap();
