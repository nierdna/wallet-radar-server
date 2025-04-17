import { Entity, Column, PrimaryColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface AdminConfigData {
  is_stop?: boolean;
  start_time?: string;
  end_time?: string;
  start_id?: number;
  current_id?: number;
  end_id?: number;
  snap_time?: Date;
  usdc?: number;
  currency?: number;
  snapshot_reward?: number;
  epoch_time?: number;
}

@Entity('admin_configs')
export class AdminConfigEntity {
  @PrimaryColumn()
  key: string;

  @Column({ nullable: true })
  value: string;

  @Column({ type: 'simple-json', nullable: true })
  data: AdminConfigData;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
