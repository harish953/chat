import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ResponseFormat } from 'src/shared/interfaces/response-format.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode =
          this.reflector.get<number>('statusCode', context.getHandler()) || response.statusCode;
        const message = this.reflector.get<string>('apiMessage', context.getHandler()) || 'Success';

        response.status(statusCode); // Explicitly set the status code

        return {
          statusCode,
          message,
          data,
        };
      }),
    );
  }
}
