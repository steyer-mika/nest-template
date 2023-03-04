import { join } from 'path';
import { WinstonModule, utilities } from 'nest-winston';
import { transports, format } from 'winston';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';

export class LoggerConfig {
  private appName: string;
  private level: string;

  constructor(configService: ConfigService) {
    const env = configService.get<string>('env');
    this.appName = configService.get<string>('app.name');
    this.level = env === 'dev' ? 'debug' : 'info';
  }

  service(): LoggerService {
    return WinstonModule.createLogger({
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.ms(),
            utilities.format.nestLike(this.appName, {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new transports.File({
          dirname: join(__dirname, `./../../logs/${this.level}/`),
          filename: `${this.level}.log`,
          level: this.level,
          format: format.combine(
            format.ms(),
            format.timestamp(),
            utilities.format.nestLike(this.appName, {
              colors: false,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    });
  }
}
