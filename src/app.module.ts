import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as pino from 'pino';

const logger = pino({
  level: process.env.NODE_ENV !== 'prod' ? 'debug' : 'info',
},pino.destination({
  minLength: 4096,
  sync: false,
}));

setInterval(function() {
  logger.flush();
}, 5000).unref();

@Module({
  imports: [
    LoggerModule.forRoot({ // This doesn't work! D:
      pinoHttp: {
        logger,
        autoLogging: true,
        serializers: {
          err: pino.stdSerializers.err,
          req: r => {
            return {
              id: r.id,
              method: r.method,
              url: r.url,
            };
          },
          res: pino.stdSerializers.res,
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
