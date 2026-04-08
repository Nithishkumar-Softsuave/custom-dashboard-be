import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default values
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = exception?.name || 'Internal Server Error';

    // If it's a known HTTP exception (like BadRequestException)
    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      status = exception.getStatus();

      if (typeof res === 'string') {
        message = [res];
      } else if (typeof res === 'object') {
        message = (res as any).message || [exception.message];
        error = (res as any).error || exception.name;
      }
    } else if (exception?.message) {
      // For non-HTTP exceptions (unexpected)
      message = [exception.message];
    }

    response.status(status).json({
      message: Array.isArray(message) ? message : [message],
      error,
      statusCode: status,
    });
  }
}
