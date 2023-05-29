import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'

export class CommonReponse<T> {
  @ApiResponseProperty({ example: 200 })
  code: number

  @ApiResponseProperty({ example: 'Error' })
  message: string

  @ApiResponseProperty({ example: [] })
  data: T
}

/**
 * response handler
 * @param res
 * @param data
 * @returns
 */
export function response<T>(content: T, code?: number, info?: string) {
  const res = { code: 200, info: 'SUCCESS', content: content || [] }

  if (code) res.code = code
  if (info) res.info = info

  return res
}
