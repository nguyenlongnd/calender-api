import { HttpException, HttpStatus } from '@nestjs/common'

export class ServerError extends HttpException {
  constructor(msg?: any) {
    super(msg || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
