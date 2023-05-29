import { Inject, Injectable } from '@nestjs/common'
import { Logger } from 'winston'

@Injectable()
export class EventService {
  constructor(@Inject('winston') private readonly logger: Logger) {}
}
