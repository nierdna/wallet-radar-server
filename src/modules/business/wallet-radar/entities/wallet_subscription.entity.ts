import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wallet_subscriptions')
export class WalletSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'wallet_address' })
  wallet_address: string;

  @Column({ name: 'token_address', nullable: true })
  token_address: string;

  @Column({ name: 'blockchain_network' })
  blockchain_network: string;

  @Column({ name: 'last_processed_block', default: 0 })
  last_processed_block: number;

  @Column({ name: 'user_id', nullable: true })
  user_id: number;

  @Column({ name: 'webhook_url', nullable: true })
  webhook_url: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;
}
