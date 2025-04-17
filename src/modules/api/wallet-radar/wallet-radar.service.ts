import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletSubscription } from '../../business/wallet-radar/entities/wallet_subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GetSubscriptionsDto } from './dto/get-subscriptions.dto';

@Injectable()
export class WalletRadarService {
  private readonly logger = new Logger(WalletRadarService.name);

  constructor(
    @InjectRepository(WalletSubscription)
    private readonly walletSubscriptionRepository: Repository<WalletSubscription>,
  ) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    try {
      // Kiểm tra xem có subscription tương tự tồn tại hay không
      const existingSubscription =
        await this.walletSubscriptionRepository.findOne({
          where: {
            wallet_address: dto.wallet_address,
            token_address: dto.token_address || null,
            blockchain_network: dto.blockchain_network,
            active: true,
          },
        });

      if (existingSubscription) {
        return existingSubscription;
      }

      // Tạo subscription mới
      const newSubscription = this.walletSubscriptionRepository.create({
        wallet_address: dto.wallet_address,
        token_address: dto.token_address,
        blockchain_network: dto.blockchain_network,
        webhook_url: dto.webhook_url,
        email: dto.email,
        last_processed_block: 0, // Bắt đầu từ block hiện tại
        active: true,
      });

      // Lưu subscription mới vào database
      const savedSubscription =
        await this.walletSubscriptionRepository.save(newSubscription);
      this.logger.log(
        `Created new wallet subscription with ID: ${savedSubscription.id}`,
      );

      return savedSubscription;
    } catch (error) {
      this.logger.error(`Failed to create subscription: ${error.message}`);
      throw error;
    }
  }

  async getSubscriptions(query: GetSubscriptionsDto) {
    try {
      // Xây dựng query conditions dựa trên filter
      const queryConditions: any = {};

      if (query.wallet_address) {
        queryConditions.wallet_address = query.wallet_address;
      }

      if (query.blockchain_network) {
        queryConditions.blockchain_network = query.blockchain_network;
      }

      if (query.user_id) {
        queryConditions.user_id = query.user_id;
      }

      if (query.active !== undefined) {
        queryConditions.active = query.active;
      }

      // Thực hiện query
      const subscriptions = await this.walletSubscriptionRepository.find({
        where: queryConditions,
        order: {
          created_at: 'DESC',
        },
      });

      return subscriptions;
    } catch (error) {
      this.logger.error(`Failed to get subscriptions: ${error.message}`);
      throw error;
    }
  }

  async getSubscriptionById(id: number) {
    try {
      const subscription = await this.walletSubscriptionRepository.findOne({
        where: { id },
      });

      if (!subscription) {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }

      return subscription;
    } catch (error) {
      this.logger.error(
        `Failed to get subscription by ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async deleteSubscription(id: number) {
    try {
      const subscription = await this.getSubscriptionById(id);

      // Xoá subscription (hoặc có thể đánh dấu là inactive)
      subscription.active = false;
      await this.walletSubscriptionRepository.save(subscription);

      this.logger.log(`Deactivated subscription with ID: ${id}`);

      return {
        success: true,
        message: `Subscription with ID ${id} deactivated`,
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete subscription with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
