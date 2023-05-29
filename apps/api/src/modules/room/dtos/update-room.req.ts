import { ApiProperty } from '@nestjs/swagger'
import { CreateRoomReq } from './create-room.req'
import { IsNotEmpty, IsOptional, Length } from 'class-validator'

export class UpdateRoomReq extends CreateRoomReq {
  @ApiProperty({ required: true, example: 'Cali', uniqueItems: true })
  @Length(3, 50, { message: 'Room name must be between 3 and 50 characters' })
  @IsOptional()
  name: string
}
