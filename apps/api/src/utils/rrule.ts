import { Injectable } from '@nestjs/common'
import { RRule, RRuleSet } from 'rrule'

@Injectable()
export class RRuleService {
  /**
   * Parse rrule string to object
   * @param rrule
   * @returns
   */
  parse(rrule: string): RRule {
    return RRule.fromString(rrule)
  }

  create(rules) {
    const rule = new RRule({
      ...rules
    })
    return rule
  }
}
