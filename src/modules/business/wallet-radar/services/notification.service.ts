import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WalletSubscription } from '../entities/wallet_subscription.entity';
import { TransactionRecord } from '../entities/transaction_record.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendAlert(
    subscription: WalletSubscription,
    transaction: TransactionRecord,
  ) {
    const alertData = {
      wallet_address: subscription.wallet_address,
      token_address: transaction.token_address,
      blockchain_network: subscription.blockchain_network,
      transaction_hash: transaction.tx_hash,
      amount: transaction.amount,
      from: transaction.from_address,
      to: transaction.to_address,
      timestamp: transaction.timestamp,
      block_number: transaction.block_number,
    };

    // Gửi webhook nếu có
    if (subscription.webhook_url) {
      try {
        await this.sendWebhook(subscription.webhook_url, alertData);
        this.logger.log(`Webhook sent for transaction ${transaction.tx_hash}`);
      } catch (error) {
        this.logger.error(
          `Failed to send webhook for transaction ${transaction.tx_hash}: ${error.message}`,
        );
      }
    }

    // Gửi email nếu có
    if (subscription.email) {
      try {
        await this.sendEmail(subscription.email, alertData);
        this.logger.log(`Email sent for transaction ${transaction.tx_hash}`);
      } catch (error) {
        this.logger.error(
          `Failed to send email for transaction ${transaction.tx_hash}: ${error.message}`,
        );
      }
    }

    return true;
  }

  private async sendWebhook(webhookUrl: string, data: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(webhookUrl, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      if (response.status >= 400) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      return true;
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`);
      throw error;
    }
  }

  private async sendEmail(email: string, data: any) {
    // TODO: Implement email service integration
    // Có thể sử dụng @nestjs/mailer hoặc một service khác

    this.logger.log(
      `Email would be sent to ${email} with data: ${JSON.stringify(data)}`,
    );
    return true;
  }
}
