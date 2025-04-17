import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainListenerService } from './blockchain-listener.service';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';
import { WalletRadarQueueModule } from '../../queue/wallet-radar/wallet-radar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletSubscription]),
    WalletRadarQueueModule,
  ],
  providers: [BlockchainListenerService],
  exports: [BlockchainListenerService],
})
export class BlockchainListenerModule {}
