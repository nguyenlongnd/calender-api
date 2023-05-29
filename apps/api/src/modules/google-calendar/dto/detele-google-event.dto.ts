import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class DeleteEventReq {
  @ApiProperty({
    required: true,
    description: 'Update type: single, all, following'
  })
  @IsEnum(['single', 'all', 'following'], {
    message: 'update_type must be a string in [single, all, following]'
  })
  delete_type: string
}
