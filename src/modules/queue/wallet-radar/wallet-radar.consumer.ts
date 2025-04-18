import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';
import { TransactionRecord } from '../../business/wallet-radar/entities/transaction_record.entity';
import { BlockchainService } from '../../business/wallet-radar/services/blockchain.service';
import { NotificationService } from '../../business/wallet-radar/services/notification.service';
import { CheckTransactionsJobDto } from '../../business/wallet-radar/interfaces/check-transactions-job.interface';

@Injectable()
@Processor('wallet-radar')
export class WalletRadarConsumer {
  private readonly logger = new Logger(WalletRadarConsumer.name);

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly notificationService: NotificationService,
    @InjectRepository(TransactionRecord)
    private readonly transactionRecordRepository: Repository<TransactionRecord>,
    @InjectRepository(WalletSubscription)
    private readonly walletSubscriptionRepository: Repository<WalletSubscription>,
  ) {}

  @Process('check-transactions')
  async checkTransactions(job: Job<CheckTransactionsJobDto>) {
    this.logger.debug(
      `Processing job ${job.id} for wallet ${job.data.subscription.wallet_address}`,
    );
    const { subscription } = job.data;

    try {
      // Kiểm tra thời gian tồn tại của subscription (tối đa 30 phút)
      const createdAt = new Date(subscription.created_at);
      const now = new Date();
      const thirtyMinutesInMs = 30 * 60 * 1000;
      const hasExpired =
        now.getTime() - createdAt.getTime() > thirtyMinutesInMs;

      // Lấy transactions mới từ blockchain
      const newTransactions = await this.blockchainService.getNewTransactions(
        subscription.wallet_address,
        subscription.token_address,
        subscription.blockchain_network,
        subscription.last_processed_block + 1,
      );

      this.logger.debug(
        `Found ${newTransactions.length} new transactions for wallet ${subscription.wallet_address}`,
      );

      // Lưu transactions mới vào database và gửi thông báo
      for (const tx of newTransactions) {
        const existingTx = await this.transactionRecordRepository.findOne({
          where: { tx_hash: tx.hash },
        });

        if (!existingTx) {
          // Lưu transaction mới
          const newTxRecord = this.transactionRecordRepository.create({
            wallet_subscription_id: subscription.id,
            tx_hash: tx.hash,
            block_number: tx.blockNumber,
            from_address: tx.from,
            to_address: tx.to || '', // Một số native token tx có thể không có 'to'
            token_address: tx.tokenAddress || '',
            amount: tx.amount.toString(),
            timestamp: new Date(tx.timestamp * 1000),
            notified: false,
          });

          await this.transactionRecordRepository.save(newTxRecord);
          this.logger.debug(`Saved new transaction record: ${tx.hash}`);

          // Gửi thông báo
          await this.notificationService.sendAlert(subscription, newTxRecord);

          // Cập nhật là đã thông báo
          newTxRecord.notified = true;
          await this.transactionRecordRepository.save(newTxRecord);
        }
      }

      // Cập nhật lastProcessedBlock
      if (newTransactions.length > 0) {
        const latestBlock = Math.max(
          ...newTransactions.map((tx) => tx.blockNumber),
        );
        subscription.last_processed_block = latestBlock;

        // Set subscription to inactive when new transactions are found
        subscription.active = false;
        this.logger.debug(
          `Setting wallet subscription to inactive for wallet ${subscription.wallet_address} after finding transactions`,
        );

        await this.walletSubscriptionRepository.save(subscription);
        this.logger.debug(
          `Updated last processed block to ${latestBlock} for wallet ${subscription.wallet_address}`,
        );
      } else if (hasExpired && subscription.active) {
        // Nếu subscription đã tồn tại hơn 30 phút và vẫn đang active nhưng không có tx nào
        subscription.active = false;
        await this.walletSubscriptionRepository.save(subscription);
        this.logger.warn(
          `Subscription for wallet ${subscription.wallet_address} has expired (after 30 minutes) with no transactions received. Setting to inactive.`,
        );
      }

      return { success: true, processed: newTransactions.length };
    } catch (error) {
      this.logger.error(
        `Error processing job ${job.id} for wallet ${subscription.wallet_address}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
