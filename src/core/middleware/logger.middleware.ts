import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import { type Request, type Response, type NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      if (originalUrl === '/favicon.ico') return;

      this.logger.log(`${method} ${originalUrl} ${statusCode} `);
    });

    next();
  }
}
