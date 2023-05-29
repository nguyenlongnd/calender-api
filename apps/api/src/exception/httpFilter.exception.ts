import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    let responseBody: unknown
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    // Response for controlled exception
    if (exception instanceof HttpException) {
      responseBody = exception.getResponse()
    }

    if (401 === exception.status) {
      responseBody = {
        code: httpStatus,
        info: 'FAIL',
        message: exception.message
      }
    }

    // Response for unhandled exception
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      responseBody = {
        code: httpStatus,
        info: 'FAIL',
        message: exception.response || 'Internal Server Error'
      }
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
