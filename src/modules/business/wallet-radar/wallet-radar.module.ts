import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WalletSubscription } from './entities/wallet_subscription.entity';
import { TransactionRecord } from './entities/transaction_record.entity';
import { BlockchainService } from './services/blockchain.service';
import { NotificationService } from './services/notification.service';
import { RabbitMQModule } from '../../common/rabbitmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletSubscription, TransactionRecord]),
    ConfigModule,
    HttpModule,
    RabbitMQModule,
  ],
  providers: [BlockchainService, NotificationService],
  exports: [BlockchainService, NotificationService],
})
export class WalletRadarBusinessModule {}
