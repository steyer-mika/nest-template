import { join } from 'path';
import { WinstonModule, utilities } from 'nest-winston';
import { transports, format } from 'winston';

export const getLoggerConfig = (env: string, appName: string) => {
  const level = env === 'dev' ? 'debug' : 'info';

  return WinstonModule.createLogger({
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.ms(),
          utilities.format.nestLike(appName, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      new transports.File({
        dirname: join(__dirname, `./../../logs/${level}/`),
        filename: `${level}.log`,
        level,
        format: format.combine(
          format.ms(),
          format.timestamp(),
          utilities.format.nestLike(appName, {
            colors: false,
            prettyPrint: true,
          }),
        ),
      }),
    ],
  });
};
