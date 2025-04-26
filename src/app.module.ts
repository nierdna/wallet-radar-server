import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { ApiModule } from './modules/api';
import { WorkerModule } from './modules/worker/worker.module';
import { WalletRadarModule } from './modules/api/wallet-radar/wallet-radar.module';
import { WalletRadarQueueModule } from './modules/queue/wallet-radar/wallet-radar.module';
import { WalletRadarBusinessModule } from './modules/business/wallet-radar/wallet-radar.module';
import { BlockchainListenerModule } from './modules/worker/blockchain-listener/blockchain-listener.module';

const isApi = Boolean(Number(process.env.IS_API || 0));
const isWorker = Boolean(Number(process.env.IS_WORKER || 0));

let _modules = [];
if (isApi) {
  _modules = [..._modules, ApiModule, WalletRadarModule];
}
if (isWorker) {
  _modules = [..._modules, WorkerModule, BlockchainListenerModule];
}
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          username: configService.get('REDIS_USERNAME'),
          family: +configService.get('REDIS_FAMILY'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    ..._modules,
    WalletRadarBusinessModule,
    WalletRadarQueueModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.APP_ENV === 'production' ? 'info' : 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            ignore: 'pid,hostname',
            messageFormat: '{msg}',
            translateTime: 'SYS:standard',
          },
        },
        customProps: () => ({
          context: 'HTTP',
        }),
        customSuccessMessage: (req, res) => {
          if (req && res) {
            return `${req.method} ${req.url}`;
          }
          return 'Request completed';
        },
        customErrorMessage: (req, res, error) => {
          if (req) {
            return `${req.method} ${req.url} failed with error: ${error.message}`;
          }
          return 'Request failed';
        },
      },
      exclude: [{ method: RequestMethod.ALL, path: 'health' }],
    }),
  ],
})
export class AppModule {}
