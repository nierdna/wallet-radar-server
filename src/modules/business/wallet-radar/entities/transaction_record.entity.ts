import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletSubscription } from './wallet_subscription.entity';

@Entity('transaction_records')
export class TransactionRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'wallet_subscription_id' })
  wallet_subscription_id: number;

  @ManyToOne(() => WalletSubscription)
  @JoinColumn({ name: 'wallet_subscription_id' })
  wallet_subscription: WalletSubscription;

  @Column({ name: 'tx_hash', unique: true })
  tx_hash: string;

  @Column({ name: 'block_number' })
  block_number: number;

  @Column({ name: 'from_address' })
  from_address: string;

  @Column({ name: 'to_address' })
  to_address: string;

  @Column({ name: 'token_address' })
  token_address: string;

  @Column()
  amount: string;

  @Column()
  timestamp: Date;

  @Column({ default: false })
  notified: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;
}
