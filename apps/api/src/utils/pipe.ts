import { PipeTransform, ArgumentMetadata, HttpException, Injectable, ConsoleLogger } from '@nestjs/common'
import { Validate } from 'class-validator'
import { ExceptionBadRequest } from '../exception/controlled.exception'
import * as moment from 'moment-timezone'

@Injectable()
export class EventDatePipe implements PipeTransform {
  transform(value: any) {
    try {
      if (!value.start || !value.end) {
        return value
      }

      if (new Date(value.start.dateTime) > new Date(value.end.dateTime)) {
        throw new ExceptionBadRequest('start.dateTime must SMALLER than end.dateTime')
      }
      if (new Date(value.start.date) > new Date(value?.end?.date)) {
        throw new ExceptionBadRequest('start.date must SMALLER than end.date')
      }

      if ((value.start.dateTime && value.end.date) || (value.start.date && value.end.dateTime)) {
        throw new ExceptionBadRequest('dateTime and date cannot exist used together, one of them must be null')
      }
      if (
        (!value.start.dateTime && !value.start.date) ||
        (!value.end.dateTime && !value.end.date) ||
        (!value.start && !value.end)
      ) {
        throw new ExceptionBadRequest('start.dateTime or start.date is required')
      }

      value.start.dateTime
        ? (value.start.dateTime = moment(value.start.dateTime).tz('Asia/Ho_Chi_Minh').format())
        : null
      value.end.dateTime ? (value.end.dateTime = moment(value.end.dateTime).tz('Asia/Ho_Chi_Minh').format()) : null

      value.start.date
        ? (value.start.date = moment(value.start.date).startOf('day').tz('Asia/Ho_Chi_Minh').format().split('T')[0])
        : null
      value.end.date
        ? (value.end.date = moment(value.end.date).startOf('day').tz('Asia/Ho_Chi_Minh').format().split('T')[0])
        : null


      return value
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
