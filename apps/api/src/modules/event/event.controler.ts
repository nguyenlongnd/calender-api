import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Logger } from 'winston'
import { GetEventReq } from '../google-calendar/dto'

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  @Get('')
  async getEvent(@Query() range: GetEventReq) {
    return ''
  }
}
