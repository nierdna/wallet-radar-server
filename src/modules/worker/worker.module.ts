import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configQueue } from './configs';
import { DatabaseModule } from '@/database';
import { ScheduleService } from './schedulers/schedule.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from '@/api';
import { BullModule } from '@nestjs/bull';
import { UserConsumer } from './consumers';

const isWorker = Boolean(Number(process.env.IS_WORKER || 0));

let consumers = [];
let schedulers = [];

if (isWorker) {
  consumers = [UserConsumer];
  schedulers = [ScheduleService];
}

@Module({
  imports: [
    ApiModule,
    DatabaseModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory(config: ConfigService) {
        const host = config.get<string>('queue.host');
        const port = config.get<number>('queue.port');
        const db = config.get<number>('queue.database');
        const password = config.get<string>('queue.password');
        const family = config.get<number>('queue.family');
        // const tls = config.get('queue.tls');
        return {
          redis: {
            host: host,
            port: port,
            db: db,
            password: password,
            family: family,
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configQueue],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [...consumers, ...schedulers],
  exports: [],
})
export class WorkerModule {}
