import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  getData(): string {
    this.logger.info('Calendar API is running!');
    return 'Calendar API is running!';
  }
}
