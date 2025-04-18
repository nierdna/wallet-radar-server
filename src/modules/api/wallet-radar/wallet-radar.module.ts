import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRadarController } from './wallet-radar.controller';
import { WalletRadarService } from './wallet-radar.service';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';
import { TransactionRecord } from '../../business/wallet-radar/entities/transaction_record.entity';
import { BlockchainService } from '../../business/wallet-radar/services/blockchain.service';
import { NotificationService } from '../../business/wallet-radar/services/notification.service';
import { HttpModule } from '@nestjs/axios';
import { RabbitMQModule } from '../../common/rabbitmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletSubscription, TransactionRecord]),
    HttpModule,
    RabbitMQModule,
  ],
  controllers: [WalletRadarController],
  providers: [WalletRadarService, BlockchainService, NotificationService],
  exports: [WalletRadarService],
})
export class WalletRadarModule {}
