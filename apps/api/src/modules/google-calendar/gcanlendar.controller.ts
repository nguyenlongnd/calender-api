import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Logger } from 'winston'
import { response } from '../../utils'
import { EventDatePipe } from '../../utils/pipe'
import { JwtAuthGuard } from '../authentication/guard/jwt.guard'
import { AuthUser, PermisionUpdate } from '../authentication/guard/role.guard'
import { CreateGoogleEventReq, DeleteEventReq, GetEventReq, UpdateGoogleEventReq } from './dto'
import { GoogleCalendarService } from './gcanlendar.service'
import { User } from './types/auth.user'

@ApiTags('Google Calendar')
@Controller('calendar')
export class GoogleCalendarController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly gcanlendarService: GoogleCalendarService
  ) {}

  @ApiOperation({ summary: 'Get All calendar events', description: 'Get calendar events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get calendar events', type: [CreateGoogleEventReq] })
  // @UseGuards(JwtAuthGuard)
  @Get('event')
  async getCalendarEvents(@Query() query: GetEventReq) {
    return response(await this.gcanlendarService.getEventsService(query))
  }

  @ApiOperation({ summary: 'Get event detail by id', description: 'Get calendar event by id' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateGoogleEventReq })
  // @UseGuards(JwtAuthGuard)
  @Get('event/:eventId')
  async getCalendarEventById(@Param('eventId') eventId: string) {
    return response(await this.gcanlendarService.getCalendarEventByIdService(eventId))
  }

  @ApiOperation({ summary: 'Update Event' })
  @ApiResponse({ status: HttpStatus.OK, type: CreateGoogleEventReq })
  @UseGuards(PermisionUpdate())
  // @UseGuards(JwtAuthGuard)
  @Put('/event/:eventId')
  async updateEvent(@Param('eventId') eventId: string, @Body(new EventDatePipe()) event: UpdateGoogleEventReq) {
    return response(await this.gcanlendarService.updateEventService(eventId, event))
  }

  @ApiResponse({ status: HttpStatus.OK, type: CreateGoogleEventReq })
  @ApiOperation({ summary: 'Create Google calendar event', description: 'Create Google calendar event' })
  // @UseGuards(JwtAuthGuard)
  @Post('/event')
  async createEvents(@Body(new EventDatePipe()) event: CreateGoogleEventReq, @AuthUser() user: User) {
    return response(await this.gcanlendarService.createEventsService(event, user))
  }

  @Get('/authorize')
  @ApiOperation({ summary: 'API for Admin only' })
  async authorizeGoogle() {
    return response(await this.gcanlendarService.authorize())
  }

  @Get('/color')
  @ApiOperation({ summary: 'Get available Calendar list colors' })
  async getAvailableColor() {
    return response(await this.gcanlendarService.getColorEventService())
  }

  @ApiOperation({ summary: 'Delete event' })
  @UseGuards(PermisionUpdate())
  // @UseGuards(JwtAuthGuard)
  @Delete('event/:eventId')
  async deleteEvent(@Param('eventId') eventId: string, @Query() query: DeleteEventReq) {
    return response(await this.gcanlendarService.deleteEventService(eventId, query))
  }

  // @UseGuards(JwtAuthGuard)
  @Get('event/instance/:eventId')
  @ApiOperation({ summary: 'Get all instances of the specified recurring event' })
  async getRecurrenceInstances(@Param('eventId') eventId: string) {
    return response(await this.gcanlendarService.getInstanceOfRecurrenceService(eventId))
  }

  @Get('oauth2callback')
  async oauth2callback(@Query('code') code: string) {
    return response(await this.gcanlendarService.oauth2callback(code))
  }
}
