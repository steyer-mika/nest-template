import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import validationConfig from '@config/validation.config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  // https://docs.nestjs.com/techniques/compression //
  app.use(compression());

  // https://docs.nestjs.com/security/helmet //
  app.use(helmet());

  // https://docs.nestjs.com/faq/global-prefix //
  app.setGlobalPrefix('api');

  // https://docs.nestjs.com/security/cors //
  app.enableCors({
    origin: config.get<string>('frontend'),
  });

  // https://docs.nestjs.com/techniques/validation //
  app.useGlobalPipes(new ValidationPipe(validationConfig));

  await app.listen(config.get<number>('port'));
};

bootstrap();
