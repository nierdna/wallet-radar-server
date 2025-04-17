import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRadarController } from './wallet-radar.controller';
import { WalletRadarService } from './wallet-radar.service';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';
import { TransactionRecord } from '../../business/wallet-radar/entities/transaction_record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletSubscription, TransactionRecord])],
  controllers: [WalletRadarController],
  providers: [WalletRadarService],
  exports: [WalletRadarService],
})
export class WalletRadarModule {}
