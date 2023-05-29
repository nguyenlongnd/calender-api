import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreateGoogleEventReq, EventDate, EventMetaData } from './create-google-event.dto'
import {
  IsBoolean,
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  Matches,
  Max,
  Min,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

export class GoogleEventReq$Optional extends CreateGoogleEventReq {
  @ApiPropertyOptional({
    description:
      'Không phải mã hex, colorId là số nguyên thuộc [0-11]. Gọi api: /api/calendar/color để lấy danh sách mã màu',
    example: '0'
  })
  @Matches(/^([0-9]|1[01])$/, {
    message: 'colorId must be a number in [0-11]'
  })
  @IsOptional()
  colorId?: string

  @ApiPropertyOptional({
    required: true,
    description:
      'Phải có một trong hai trường: dateTime hoặc date. Nếu có dateTime thì sẽ không có date. Lưu ý TimeZone',
    example: {
      dateTime: '2021-08-01T09:00:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    }
  })
  @IsNotEmptyObject()
  @IsObject()
  @IsOptional()
  @Type(() => EventDate)
  start: EventDate

  @ApiPropertyOptional({
    required: true,
    description:
      'Phải có một trong hai trường: dateTime hoặc date. Nếu có dateTime thì sẽ không có date.Lưu ý TimeZone',
    example: {
      dateTime: '2021-08-01T09:30:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    }
  })
  @IsNotEmptyObject()
  @IsObject()
  @IsOptional()
  @Type(() => EventDate)
  end: EventDate

  @ApiProperty({
    required: true,
    description: 'Title of Event',
    example: 'Event title'
  })
  @IsOptional()
  summary?: string

  @ApiPropertyOptional({
    description: 'Có xóa meet hay không',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_remove_meet?: boolean

  @ApiProperty({
    required: true,
    description: 'Meta của Event. Lưu ý: room_id là bắt buộc',
    example: {
      room_id: '123456789',
      room_name: '1321'
    }
  })
  @IsObject()
  @Type(() => EventMetaData)
  @ValidateNested()
  @IsOptional()
  extendedProperties: EventMetaData

  @ApiProperty({
    required: true,
    description:
      'single: chỉ update event này, all: update tất cả các instance event, follow: update tất cả các event sau event này',
    example: 'single | all | following'
  })
  @IsEnum(['single', 'all', 'following'], {
    message: 'update_type must be a string in [single, all, following]'
  })
  update_type: string
}

export class UpdateGoogleEventReq extends GoogleEventReq$Optional {}
