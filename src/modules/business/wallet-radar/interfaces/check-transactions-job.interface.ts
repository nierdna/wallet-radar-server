import { WalletSubscription } from '../entities/wallet_subscription.entity';

export interface CheckTransactionsJobDto {
  subscription: WalletSubscription;
}
