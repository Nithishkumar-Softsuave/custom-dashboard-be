import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (response?.error) {
          if (response.error.type && response.error.message) {
            return {
              message: [response.error.message || 'Request failed'],
              error: response.error.type || 'Bad Request',
              statusCode: response.error.code || 400,
            };
          }
        }
        return {
          success: true,
          message: response?.message || 'Request successful',
          data: response?.data ?? response,
          statusCode: response?.code || 200,
        };
      }),
    );
  }
}
