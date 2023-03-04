import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from '@/app.module';
import { LoggerConfig } from '@/config/logger';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const config = app.get<ConfigService>(ConfigService);

  // https://github.com/gremo/nest-winston //
  const logger = new LoggerConfig(config);
  app.useLogger(logger.service());

  // https://docs.nestjs.com/techniques/compression //
  app.use(compression());

  // https://docs.nestjs.com/security/helmet //
  app.use(
    helmet({
      crossOriginResourcePolicy: true,
    }),
  );

  // https://docs.nestjs.com/faq/global-prefix //
  app.setGlobalPrefix('api');

  // https://docs.nestjs.com/security/cors //
  app.enableCors({
    origin: config.get<string>('frontend'),
  });

  // https://docs.nestjs.com/techniques/validation //
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  // https://docs.nestjs.com/openapi/introduction //
  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.get<string>('app.name'))
    .setDescription(`${config.get<string>('app.name')} API`)
    .setVersion(process.env.npm_package_version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    customfavIcon: 'favicon.ico',
  });

  await app.listen(config.get<number>('app.port'));
};

bootstrap();
