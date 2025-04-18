import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';
import { WalletRadarProducer } from '../../queue/wallet-radar/wallet-radar.producer';

@Injectable()
export class BlockchainListenerService {
  private readonly logger = new Logger(BlockchainListenerService.name);

  constructor(
    @InjectRepository(WalletSubscription)
    private readonly walletSubscriptionRepository: Repository<WalletSubscription>,
    private readonly walletRadarQueue: WalletRadarProducer,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS) // Chạy mỗi 30 giây
  async checkNewTransactions() {
    this.logger.log('Starting scheduled job to check for new transactions');

    try {
      const activeSubscriptions = await this.walletSubscriptionRepository.find({
        where: { active: true },
      });

      this.logger.debug(
        `Found ${activeSubscriptions.length} active subscriptions to process`,
      );

      for (const subscription of activeSubscriptions) {
        await this.walletRadarQueue.addTransactionCheckJob(subscription);
      }

      this.logger.log('Scheduled job completed successfully');
    } catch (error) {
      this.logger.error(
        `Error in scheduled job: ${error.message}`,
        error.stack,
      );
    }
  }
}
