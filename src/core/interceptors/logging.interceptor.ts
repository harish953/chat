import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    const { headers, query, body } = request;

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const responseTime = Date.now() - now;

        this.logger.log(`${method} ${url} ${statusCode} ${responseTime}ms`, 'LoggingInterceptor');

        if (process.env.NODE_ENV !== 'production') {
          this.logger.debug(
            `Request: ${JSON.stringify({ method, url, headers, query, body })}`,
            'LoggingInterceptor',
          );
          this.logger.debug(
            `Response: ${JSON.stringify({ statusCode, responseTime })}`,
            'LoggingInterceptor',
          );
        }
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        this.logger.error(
          ` ${method} ${url} ${error.status || 500} ${responseTime}ms`,
          error.stack,
          'LoggingInterceptor',
        );
        throw error;
      }),
    );
  }
}
