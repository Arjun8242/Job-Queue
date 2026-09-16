import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let error = 'Http Exception';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if ('message' in exceptionResponse) {
        const msg = (exceptionResponse as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      }
      if ('error' in exceptionResponse) {
        error = (exceptionResponse as any).error;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
