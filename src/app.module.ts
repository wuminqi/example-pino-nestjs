import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as pino from 'pino';

import { TypeOrmModule } from '@nestjs/typeorm';

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
    LoggerModule.forRoot({
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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '111111111',
      port: 3306,
      username: 'whatever',
      password: 'never',
      database: 'mind',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
