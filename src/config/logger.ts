import { WinstonModule, utilities } from 'nest-winston';
import { join } from 'path';
import { format, transports } from 'winston';

const getLogLevel = (environment: string | undefined) => {
  switch (environment) {
    case 'local':
    case 'development':
      return 'debug';

    case 'staging':
    case 'production':
      return 'info';

    default: {
      console.warn(
        `Unknown environment: ${environment}. Defaulting to 'info' log level.`,
      );
      return 'info';
    }
  }
};

export const loggerFactory = (
  appName: string | undefined,
  environment: string | undefined,
) => {
  const level = getLogLevel(environment);

  if (!appName) {
    console.warn('No application name provided. Defaulting to "NestWinston"');
  }

  return WinstonModule.createLogger({
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.ms(),
          utilities.format.nestLike(appName, {
            colors: true,
            appName: true,
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
            appName: true,
            processId: true,
          }),
        ),
      }),
    ],
  });
};
