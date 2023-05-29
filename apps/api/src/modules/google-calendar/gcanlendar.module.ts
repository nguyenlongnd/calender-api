import { Module } from '@nestjs/common'
import { GoogleCalendarController } from './gcanlendar.controller'
import { GoogleCalendarService } from './gcanlendar.service'
import { AuthModule } from '../authentication/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [GoogleCalendarController],
  providers: [GoogleCalendarService],
  exports: []
})
export class GoogleCalendarModule {}
