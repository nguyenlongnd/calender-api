import * as moment from 'moment-timezone'
import { Event } from '../modules/google-calendar/gcanlendar.service'

export function checkOverLapTime(time1: any, time2: any) {
  const time1Start = moment(time1.start)
  const time1End = moment(time1.end)
  const time2Start = moment(time2.start)
  const time2End = moment(time2.end)
  if (
    time1Start.isBetween(time2Start, time2End) ||
    time1End.isBetween(time2Start, time2End) ||
    time2Start.isBetween(time1Start, time1End) ||
    time2End.isBetween(time1Start, time1End)
  ) {
    return true
  }
  return false
}

export function getTheFirstInstance(eventList: Event[]) {
  if (eventList.length === 0) return null
  if (eventList.length === 1) return eventList[0]
  return eventList.sort((a, b) => {
    return new Date(a.id.split('_')[0]).getTime() - new Date(b.id.split('_')[0]).getTime()
  })
}

export function date_sort_asc(date1: string, date2: string) {
  if (new Date(date1).getTime() >= new Date(date2).getTime()) {
    return 1
  }
  return -1
}

export function date_diff(date1: string, date2: string) {
  if (new Date(date1).getTime() !== new Date(date2).getTime()) {
    return {
      status: true,
      value: new Date(date1).getTime() - new Date(date2).getTime()
    }
  }
  return {
    status: false,
    value: 0
  }
}

export function date_add_milisecond(time: string, amount: number) {
  return moment(new Date(time)).add(amount, 'milliseconds').toDate().toISOString()
}

export function getDateOnly(rrule_string: string) {
  return moment(rrule_string.split('T')[0]).toDate()
}

// Hàm này nhận vào một Event, trả về thời gian trước đó
// Thời gian bị trừ lấy từ trường orginalStartTime
// days: số ngày cần trừ
// unit: đơn vị thời gian cần trừ
export function date_substract(date: Event, days: number, unit?: any) {
  return moment(new Date(date.originalStartTime.date || date.originalStartTime.dateTime))
    .subtract(days, unit || 'days')
    .endOf('day')
    .toDate()
}

export function date_add(date: Event, days: number, unit?: any) {
  return moment(new Date(date.originalStartTime.date || date.originalStartTime.dateTime))
    .add(days, unit || 'days')
    .toDate()
}
