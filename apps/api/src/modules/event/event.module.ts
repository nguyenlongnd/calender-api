import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MeetingRoom, UserEntity } from '../typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom, UserEntity])],
  controllers: [],
  providers: [],
  exports: []
})
export class EventModule {}
