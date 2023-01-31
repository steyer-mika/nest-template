import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length')
        ? response.get('content-length') + ' '
        : '';

      if (originalUrl === '/favicon.ico') return;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength}- ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
