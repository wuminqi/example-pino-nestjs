import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectPinoLogger(AppController.name) private readonly logger: PinoLogger,
    ) {}

  @Get()
  getHello(): string {
    this.logger.info('~'.repeat(20));
    return this.appService.getHello();
  }
}
