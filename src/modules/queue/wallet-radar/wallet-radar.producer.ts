import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';

@Injectable()
export class WalletRadarProducer {
  private readonly logger = new Logger(WalletRadarProducer.name);

  constructor(
    @InjectQueue('wallet-radar')
    private readonly walletRadarQueue: Queue,
  ) {}

  async addTransactionCheckJob(subscription: WalletSubscription) {
    try {
      const job = await this.walletRadarQueue.add(
        'check-transactions',
        { subscription },
        {
          // Không retry tự động, vì sẽ được chạy lại trong cronjob tiếp theo
          attempts: 1,
          // Thời gian remove khỏi queue sau khi hoàn thành (1 giờ)
          removeOnComplete: 3600,
          // Thời gian remove khỏi queue sau khi failed (1 ngày)
          removeOnFail: 86400,
        },
      );

      this.logger.debug(
        `Added check-transactions job for wallet ${subscription.wallet_address} with ID: ${job.id}`,
      );

      return job;
    } catch (error) {
      this.logger.error(
        `Failed to add check-transactions job: ${error.message}`,
      );
      throw error;
    }
  }
}
