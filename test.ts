var moment = require('moment')
import { Injectable } from '@nestjs/common'
import { RRule, RRuleSet } from 'rrule'

// const startDate = moment('2023-04-27T03:00:00.000Z').add(3, 'days').startOf('day').format()

// console.log(startDate)
// console.log(moment().add(10, 'day').startOf('day').format())

// const a = { c: 'c' } as any

// console.log(new Date(a.d || '2023-04-27T10:00:00+07:00'))
// console.log(new Date('2023-09-09T17:00:01Z').getTime())
// console.log(new Date('2023-09-10T00:00:01+07:00').getTime())
// console.log(new Date('2023-09-09T17:00:01Z').getTime() !== new Date('2023-09-10T00:00:01+07:00').getTime())

const amount = new Date('2023-09-09T17:00:01Z').getTime() - new Date('2023-09-10T01:00:01+07:00').getTime()

console.log(amount)

export function date_add_milisecond(time: string, amount: number) {
  return new Date(new Date(time).getTime() + amount).toISOString()
}

console.log(date_add_milisecond('2023-09-10T01:00:01+07:00', amount))
console.log(new Date('2023-09-09T17:00:01Z').getTime())

// export class RRuleService {
//   /**
//    * Parse rrule string to object
//    * @param rrule
//    * @returns
//    */
//   parse(rrule: any) {
//     return RRule.parseString(rrule)
//   }

//   create() {
//     const rule = new RRule({
//       freq: RRule.DAILY,
//       interval: 1,
//       count: 5,
//       until: new Date(Date.UTC(2021, 11, 1, 9, 30))
//     })
//     return rule
//   }
// }
// const acb = new RRuleService().parse('RRULE:FREQ=WEEKLY;WKST=SU;UNTIL=20230508T165959Z;BYDAY=TU')
// const acbd = new RRuleService().parse('RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=TU;UNTIL=20230508T165959Z')
// console.log(acb)
// console.log(acbd)

// console.log(
//   new RRule({
//     ...acb
//   })
//     .toString()
//     .split(';')
//     .sort()
//     .join(';')
// )

// const newRRule = new RRule({
//   until: moment(new Date('2023-05-09')).subtract(1, 'days').toDate().toString().split('T')[0]
// }).toString()

// console.log('1', newRRule)

// console.log('2', moment(new Date('2023-05-09')).subtract(1, 'days').format().split('T'))
// console.log(moment(new Date('2023-05-09T14:30:00+07:00')).subtract(1, 'days').toISOString())

// console.log(new Date('2023-05-08T16:59.59Z'))

// const dates = [
//   '2023-04-25T10:00:00+07:00',
//   '2023-04-21T11:00:00+07:00',
//   '2023-04-28T12:00:00+07:00',
//   '2023-04-29T13:00:00+07:00',
//   '2023-04-30T14:00:00+07:00',
//   '2023-04-26T15:00:00+07:00'
// ]

// export function date_diff(date1: any, date2: any) {
//   if (new Date(date1).getTime() >= new Date(date2).getTime()) {
//     return 1
//   }
//   return -1
// }

// console.log(
//   dates.filter((event) => {
//     return date_diff(event, '2023-04-29T13:00:00+07:00') === 1
//   })
// )

// console.log(process.cwd())

function abc(updateRequest: any, recurrenceEvent: any) {
  console.log(JSON.stringify(updateRequest.recurrence)?.split('').sort().join(''))
  console.log(
    JSON.stringify(recurrenceEvent.recurrence || updateRequest.recurrence)
      ?.split('')
      .sort()
      .join('')
  )

  const compareTwoDate =
    updateRequest.recurrence &&
    JSON.stringify(updateRequest.recurrence)?.split('').sort().join('') !==
      JSON.stringify(recurrenceEvent.recurrence || updateRequest.recurrence)
        ?.split('')
        .sort()
        .join('')

  if (compareTwoDate) {
    return { result: true, message: 'Recurrence rule is not match' }
  }
  return { result: false, message: 'Recurrence rule is  match' }
}
const a = {
  recurrence: ['RRULE:FREQ=DAILY;COUNT=4;INTERVAL=2']
}
const b = {
  recurrence: ['RRULE:FREQ=DAILY;INTERVAL=2;COUNT=4']
}

console.log(abc(a, b))
