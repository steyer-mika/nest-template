import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import validationConfig from '@config/validation.config';
import { getLoggerConfig } from '@/config/logger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const config = app.get<ConfigService>(ConfigService);

  // https://github.com/gremo/nest-winston
  app.useLogger(getLoggerConfig(config.get('env'), config.get('app.name')));

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
    origin: config.get<string>('frontend'),
  });

  // https://docs.nestjs.com/techniques/validation //
  app.useGlobalPipes(new ValidationPipe(validationConfig));

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
