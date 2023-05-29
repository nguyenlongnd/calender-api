import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { response } from '../utils'

export class CustomeValidationPipe extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      return await super.transform(value, metadata)
    } catch (error) {
      if (error instanceof BadRequestException) {
        const errors = error.getResponse() as ValidationError[]
        throw new BadRequestException(response(errors, 400, 'VALIDATION FAIL'))
      }
    }
  }
}
