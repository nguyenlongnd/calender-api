import { ApiResponseProperty } from '@nestjs/swagger'
import { MeetingRoom } from '../../typeorm'
import { Metadata } from '../../../types'
export class GetRoomRes {
  @ApiResponseProperty({
    type: Array,
    example: [
      {
        id: 1,
        title: 'String',
        content: 'String',
        createdDate: new Date()
      }
    ]
  })
  data: MeetingRoom[]

  @ApiResponseProperty({
    type: Object,
    example: {
      total: 1,
      itemPage: 1,
      currentPage: 1,
      lastPage: 1
    }
  })
  metadata: Metadata
}
