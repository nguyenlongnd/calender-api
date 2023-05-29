import { IsNumberString } from 'class-validator'

export class RoomId {
  @IsNumberString({}, { message: 'Room ID must be a number' })
  id: string
}
