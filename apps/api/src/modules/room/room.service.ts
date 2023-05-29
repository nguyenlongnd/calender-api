import { Inject, Injectable } from '@nestjs/common'
import { Logger } from 'winston'
import { MeetingRoom } from '../typeorm'
import { UserEntity } from '../typeorm'
import { CreateRoomReq } from './dtos/create-room.req'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { ExceptionConflict, ExceptionNotFound } from '../../exception/controlled.exception'
import { GetRoomRes } from './dtos/get-rooms.res'
import { Pagination } from '../../types'

@Injectable()
export class RoomService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(MeetingRoom) private readonly meetingRoomRepository: Repository<MeetingRoom>,
    @InjectRepository(UserEntity) private readonly userEntity: Repository<UserEntity>
  ) {}

  async createMeetingRoomService(body: CreateRoomReq): Promise<MeetingRoom> {
    try {
      const existedRoom = await this.meetingRoomRepository.findOne({
        where: { name: body.name }
      })

      if (existedRoom) {
        throw new ExceptionConflict('Room name already existed')
      }

      const { name, description, capacity, location, status, devices, colorId } = body

      const newRoom = this.meetingRoomRepository.create({
        name,
        description,
        capacity,
        location,
        status,
        devices,
        colorId
      })

      return await this.meetingRoomRepository.save(newRoom)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async getAllRoomsService(): Promise<MeetingRoom[]> {
    try {
      return await this.meetingRoomRepository.find()
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async getRoomByIdService(id: string): Promise<any> {
    try {
      const room = await this.meetingRoomRepository.findOne({
        where: { id }
      })

      // const res = await this.dataSource
      //   .createQueryBuilder()
      //   .select([
      //     'meeting_room.id as id',
      //     'meeting_room.name as name',
      //     'meeting_room.description as description',
      //     'meeting_room.capacity as capacity',
      //     'meeting_room.location as location',
      //     'meeting_room.status as status',
      //     'user_entity.id as user_id',
      //     'user_entity.name as user_name',
      //     'user_entity.email as user_email'
      //   ])
      //   .from('calendar.meeting_room', 'meeting_room') // Alisas name could === table's name
      //   .addFrom('core_admin.user', 'user_entity') // Alias HAVE TO !== table's name
      //   .where('meeting_room.user_id = user_entity.id')
      //   .getRawMany() // important

      if (!room) {
        throw new ExceptionNotFound('Room not found')
      }
      return room
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async updateRoomByIdService(id: string, body: CreateRoomReq): Promise<MeetingRoom> {
    try {
      const existedRoom = await this.dataSource.manager.findOne(MeetingRoom, {
        where: { id }
      })

      if (!existedRoom) {
        throw new ExceptionNotFound('Room not found')
      }
      if (body.name && body.name !== existedRoom.name) {
        const existedRoomName = await this.dataSource.manager.findOne(MeetingRoom, {
          where: { name: body.name }
        })

        if (existedRoomName && existedRoomName.id !== id) {
          throw new ExceptionConflict('Room name already existed')
        }
      }

      for (const key in existedRoom) {
        if (body[key]) {
          existedRoom[key] = body[key]
        }
      }

      return await this.meetingRoomRepository.save(existedRoom)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async deleteRoomByIdService(id: string): Promise<string> {
    try {
      const existedRoom = await this.dataSource.manager.findOne(MeetingRoom, {
        where: { id }
      })

      if (!existedRoom) {
        throw new ExceptionNotFound('Room not found')
      }

      await this.meetingRoomRepository.remove(existedRoom)
      return 'Room deleted successfully'
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
