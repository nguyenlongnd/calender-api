import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CommonReponse } from '../utils'

@ApiTags('Common Response Format')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    type: CommonReponse
  })
  getData() {
    return this.appService.getData()
  }
}
