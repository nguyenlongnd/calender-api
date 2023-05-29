import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GoogleCalendarModule } from '../modules/google-calendar/gcanlendar.module'

import { WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { TypeormConfigModule } from '../modules/typeorm/typeorm.module'
import { AuthModule } from '../modules/authentication/auth.module'
import { RoomModule } from '../modules/room/room.module'
import { EventModule } from '../modules/event/event.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    // For TypeORM Postgres
    TypeormConfigModule,
    // For Winston Logger
    WinstonModule.forRoot({
      format: format.combine(
        format.errors({ stack: true }),
        format.splat(),
        format.timestamp({
          format: () => new Date().toLocaleString()
        }),
        format.printf((log) => {
          const { timestamp, level, message, ...args } = log
          const ts = timestamp.slice(0, 19).replace('T', ' ')
          return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`
        })
      ),
      transports: [
        new transports.Console({
          level: 'debug',
          handleExceptions: true
        }),
        new DailyRotateFile({
          dirname: './logs/infos/',
          filename: 'info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '2d',
          maxSize: '20m',
          zippedArchive: false,
          level: 'info'
        }),
        new DailyRotateFile({
          dirname: './logs/erros/',
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '2d',
          maxSize: '20m',
          zippedArchive: false,
          level: 'error'
        })
      ]
    }),
    AuthModule,
    GoogleCalendarModule,
    RoomModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
