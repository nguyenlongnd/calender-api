import { IsNotEmpty, IsNumber, IsOptional, Length, IsArray, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoomReq {
  @ApiProperty({ required: true, example: 'Cali', uniqueItems: true })
  @IsNotEmpty({ message: 'Room name is required' })
  @Length(3, 50, { message: 'Room name must be between 3 and 50 characters' })
  name: string

  @ApiProperty({ required: true, example: 'HL HANOI' })
  @IsNotEmpty({ message: 'Location is required' })
  location: string

  @ApiProperty({ required: false, example: ['TV', 'projector'] })
  @IsArray({ message: 'devcies must be an array' })
  @IsString({ each: true })
  devices: string[]

  @ApiProperty({ required: false, example: 'Phòng to nhất SETA' })
  @IsOptional()
  description: string

  @ApiProperty({ required: true, example: 10 })
  @IsNotEmpty({ message: 'Capacity is required' })
  @IsNumber({}, { message: 'Capacity must be a number' })
  capacity: number

  @ApiProperty({ required: false, example: 'opening | close' })
  @IsOptional()
  status: string

  @ApiProperty({ required: false, example: '0 (white)' })
  @IsOptional()
  colorId: string
}
