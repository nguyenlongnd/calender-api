import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import * as moment from 'moment-timezone'

export class GetEventReq {
  @ApiProperty({
    description: 'timeMin',
    example: `<div>import * as moment from 'moment-timezone'</div> <br> moment().add(3, 'days').startOf('day').tz('Asia/Ho_Chi_Minh').format() \n <div> ${moment()
      .add(0, 'days')
      .startOf('day')
      .tz('Asia/Ho_Chi_Minh')
      .format()}
      </div> `
  })
  @IsNotEmpty()
  timeMin: string

  @ApiProperty({
    description: 'timeMax',
    example: `<div>import * as moment from 'moment-timezone'</div> <br> moment().add(3, 'days').startOf('day').tz('Asia/Ho_Chi_Minh').format() \n <div> ${moment()
      .add(7, 'days')
      .startOf('day')
      .tz('Asia/Ho_Chi_Minh')
      .format()}
      </div> `
  })
  @IsNotEmpty()
  timeMax: string

  @ApiPropertyOptional({ description: 'room_id', example: 'room_id' })
  @IsString()
  @IsOptional()
  room_id: string

  @ApiPropertyOptional({ description: 'creator_id', example: 'creator_id' })
  @IsString()
  @IsOptional()
  creator_id: string

  @ApiPropertyOptional({ description: 'creator_id', example: 'creator_id' })
  @IsString()
  @IsOptional()
  creator_email: string

  @ApiPropertyOptional({ description: 'candidate_id', example: 'candidate_id' })
  @IsOptional()
  candidate_id: string
}
