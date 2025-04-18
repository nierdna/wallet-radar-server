import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRadarController } from './wallet-radar.controller';
import { WalletRadarService } from './wallet-radar.service';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';
import { TransactionRecord } from '../../business/wallet-radar/entities/transaction_record.entity';
import { BlockchainService } from '../../business/wallet-radar/services/blockchain.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletSubscription, TransactionRecord])],
  controllers: [WalletRadarController],
  providers: [WalletRadarService, BlockchainService],
  exports: [WalletRadarService],
})
export class WalletRadarModule {}
