import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export interface AuthClient {
  type?: string
  client_id?: string
  client_secret?: string
  refresh_token?: string
}
export type Status = {
  result: boolean
  message: string
}

export type Metadata = {
  total: number
  itemPage: number
  currentPage: number
  lastPage: number
}

export class Pagination {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty({
    message: 'page is required'
  })
  @IsNumber({}, { message: 'page must be a number' })
  @Min(1, { message: 'page must be greater than 0' })
  @Type(() => Number)
  page: number

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty({
    message: 'limit is required'
  })
  @IsNumber({}, { message: 'limit must be a number' })
  @Min(1, { message: 'limit must be greater than 0' })
  @Max(100, { message: 'limit must be less than 100' })
  @Type(() => Number)
  limit: number
}
