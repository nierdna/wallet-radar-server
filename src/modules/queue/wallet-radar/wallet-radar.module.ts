import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WalletRadarProducer } from './wallet-radar.producer';
import { WalletRadarConsumer } from './wallet-radar.consumer';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';
import { TransactionRecord } from '../../business/wallet-radar/entities/transaction_record.entity';
import { BlockchainService } from '../../business/wallet-radar/services/blockchain.service';
import { NotificationService } from '../../business/wallet-radar/services/notification.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'wallet-radar',
    }),
    TypeOrmModule.forFeature([WalletSubscription, TransactionRecord]),
    HttpModule,
  ],
  providers: [
    WalletRadarProducer,
    WalletRadarConsumer,
    BlockchainService,
    NotificationService,
  ],
  exports: [WalletRadarProducer],
})
export class WalletRadarQueueModule {}
