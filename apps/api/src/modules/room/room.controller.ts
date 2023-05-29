import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Logger } from 'winston'
import { MeetingRoom } from '../typeorm'
import { RoomService } from './room.service'
import { CreateRoomReq } from './dtos/create-room.req'
import { RoomId } from './dtos/get-room.req'
import { CreateRoomRes } from './dtos/create-room.res'
import { GetRoomRes } from './dtos/get-rooms.res'
import { response } from '../../utils'
import { UpdateRoomReq } from './dtos/update-room.req'
@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(@Inject('winston') private readonly logger: Logger, private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Create a meeting room' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Create a meeting room', type: CreateRoomRes })
  @Post()
  async createMeetingRoom(@Body() body: CreateRoomReq) {
    return response<MeetingRoom>(await this.roomService.createMeetingRoomService(body))
  }

  @ApiOperation({ summary: 'Get Room List' })
  @ApiResponse({ type: CreateRoomRes })
  @Get()
  async getAllRooms() {
    return response<MeetingRoom[]>(await this.roomService.getAllRoomsService())
  }

  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Create a meeting room', type: GetRoomRes })
  @Get(':id')
  async getRoomById(@Param() params: RoomId) {
    return response<MeetingRoom>(await this.roomService.getRoomByIdService(params.id))
  }

  @ApiOperation({ summary: 'Update room infomation (Update info, lock room' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Create a meeting room', type: CreateRoomRes })
  @Put(':id')
  async updateRoomById(@Body() body: UpdateRoomReq, @Param() params: RoomId) {
    return response<MeetingRoom>(await this.roomService.updateRoomByIdService(params.id, body))
  }

  @ApiOperation({ summary: 'Delete room by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Delete room by ID' })
  @Delete(':id')
  async deleteRoomById(@Param() params: RoomId) {
    return response<string>(await this.roomService.deleteRoomByIdService(params.id))
  }
}
