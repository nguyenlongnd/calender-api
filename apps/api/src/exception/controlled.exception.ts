import { HttpException, HttpStatus } from '@nestjs/common'
import { response } from '../utils'

export class UnauthorizedException extends HttpException {
  constructor(msg?: unknown) {
    super({ code: HttpStatus.UNAUTHORIZED, message: msg || 'Unauthorized' }, HttpStatus.UNAUTHORIZED)
  }
}

export class ExceptionConflict extends HttpException {
  constructor(msg?: unknown) {
    super(
      response({ code: HttpStatus.CONFLICT, message: msg || 'Already exists' }, HttpStatus.CONFLICT, 'FAIL'),
      HttpStatus.CONFLICT
    )
  }
}

export class ExceptionNotFound extends HttpException {
  constructor(msg?: unknown) {
    super(response({ message: msg || 'Not found' }, HttpStatus.NOT_FOUND, 'FAIL'), HttpStatus.NOT_FOUND)
  }
}

export class ExceptionBadRequest extends HttpException {
  constructor(msg?: unknown) {
    super(
      response({ code: HttpStatus.BAD_REQUEST, message: msg || 'Bad request' }, HttpStatus.BAD_REQUEST, 'FAIL'),
      HttpStatus.BAD_REQUEST
    )
  }
}

export class ExceptionUnauthorized extends HttpException {
  constructor(msg?: unknown) {
    super(
      response({ code: HttpStatus.UNAUTHORIZED, message: msg || 'Unauthorized' }, HttpStatus.UNAUTHORIZED, 'FAIL'),
      HttpStatus.UNAUTHORIZED
    )
  }
}

export class ExceptionForbidden extends HttpException {
  constructor(msg?: unknown) {
    super(
      response({ code: HttpStatus.FORBIDDEN, message: msg || 'Forbidden' }, HttpStatus.FORBIDDEN, 'FAIL'),
      HttpStatus.FORBIDDEN
    )
  }
}
