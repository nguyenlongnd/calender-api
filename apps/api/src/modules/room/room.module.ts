import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MeetingRoom, UserEntity } from '../typeorm'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom, UserEntity])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: []
})
export class RoomModule {}
