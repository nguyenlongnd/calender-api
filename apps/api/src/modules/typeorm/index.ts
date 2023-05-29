import { RoomEntity } from './entities/room.entity'
import { UserEntity } from './entities/user.entity'
import { EventEntity } from './entities/event.entity'
import { RecurrenEventEntity } from './entities/recurrence_event.entity'

export const entities = [RoomEntity, UserEntity, EventEntity, RecurrenEventEntity]

export { RoomEntity as MeetingRoom, UserEntity, EventEntity, RecurrenEventEntity }
