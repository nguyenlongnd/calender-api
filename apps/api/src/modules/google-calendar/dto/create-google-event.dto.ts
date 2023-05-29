import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested
} from 'class-validator'

export class Email {
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class EventDate {
  @ApiProperty({
    required: true,
    description:
      'Phải có cả hai trường: dateTime và date .Một trong hai phải bằng null. <h3> date dành cho Event cả ngày. dateTime dành cho Event có giờ giấc </h3>',
    example: 'Có thể là dạng ISO: 2023-01-17T02:34:01.000Z or UTC: 2023-04-27T10:00:00+07:00 or 2023-01-17 '
  })
  // @IsDateString({
  //   message: 'dateTime must be a date string'
  // })
  @IsOptional()
  dateTime: string

  @ApiProperty({
    required: true,
    description:
      'Phải có cả hai trường: dateTime và date.Một trong hai phải bằng null. <h3> date dành cho Event cả ngày. dateTime dành cho Event có giờ giấc </h3>',
    example: 'Có thể là dạng ISO: 2023-01-17T02:34:01.000Z or UTC: 2023-04-27T10:00:00+07:00 or 2023-01-17'
  })
  // @IsDateString({
  //   message: 'date must be a date string'
  // })
  @IsOptional()
  date: string

  @ApiPropertyOptional({
    description: 'Mặc định bằng Asia/Ho_Chi_Minh',
    example: 'Asia/Ho_Chi_Minh'
  })
  @IsString({
    message: 'timeZone must be a string'
  })
  @IsOptional()
  timeZone: string
}

export class EventMetaData {
  @ApiProperty({ required: false, description: 'CALI' })
  @IsString({ message: 'Room name must be a string' })
  @IsOptional()
  name?: string

  @ApiProperty({ required: true, description: 'room_id' })
  @IsNotEmpty({ message: 'room_id is required, phỏng vấn online, room_id = "null" ' })
  room_id?: string

  @ApiPropertyOptional({ description: 'creator_id' })
  @IsOptional()
  creator_id?: string

  @ApiPropertyOptional({ description: 'creator_email' })
  @IsOptional()
  creator_email?: string

  @ApiPropertyOptional({ description: 'attendee_ids' })
  @IsOptional()
  attendees_id?: string

  @ApiPropertyOptional({ description: 'candidate_id' })
  @IsOptional()
  candidate_id?: string
}

export class Creator {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  id?: string
}

export class CreateGoogleEventReq {
  @ApiProperty({
    description:
      'Không phải mã hex, colorId là số nguyên thuộc [0-11]. Gọi api: /api/calendar/color để lấy danh sách mã màu',
    example: '5'
  })
  @Matches(/^([0-9]|1[01])$/, { message: 'colorId must be a number in [0-11]' })
  colorId?: string

  @ApiProperty({ required: true, description: 'Title of Event', example: 'Event title' })
  @IsNotEmpty({ message: 'Event summary is required' })
  @IsOptional()
  summary?: string

  @ApiPropertyOptional({ description: 'Description of Events abcef' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ example: 'Hanoi, Vietnam' })
  @IsOptional()
  location?: string

  @ApiPropertyOptional({ example: 'abc@gmail.com' })
  @IsObject({ message: 'creator must be an object' })
  @IsOptional()
  @Type(() => Creator)
  @ValidateNested()
  creator?: Creator

  @ApiPropertyOptional({
    description: 'Recurrent of events (RRULE lib: )',
    example: '[RRULE:FREQ=DAILY;COUNT=2;UNTIL=20230117T104400Z] \n '
  })
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  recurrence?: string[]

  @ApiPropertyOptional({
    description: 'Attendees of events',
    example: [
      {
        email: '19020202@vnu.edu.vn'
      }
    ]
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Email)
  @IsArray({
    message: 'attendees must be an array'
  })
  @IsObject({
    each: true
  }) // Exclude for 2d array: [[]]
  attendees: Email[]

  @ApiProperty({
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
  @Type(() => EventDate)
  @ValidateNested()
  start: EventDate

  @ApiProperty({
    required: true,
    description:
      'Phải có một trong hai trường: dateTime hoặc date. Nếu có dateTime thì sẽ không có date.Lưu ý TimeZone',
    example: {
      dateTime: '2021-08-01T09:00:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    }
  })
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => EventDate)
  @ValidateNested()
  end: EventDate

  @ApiPropertyOptional({
    description: 'Có tạo meeting mới không?',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_new_meet: boolean

  @ApiProperty({
    required: true,
    description: 'Meta của Event. Lưu ý: room_id là bắt buộc',
    example: {
      room_id: '123456789',
      room_name: '1321'
    }
  })
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => EventMetaData)
  @ValidateNested()
  extendedProperties: EventMetaData
}
