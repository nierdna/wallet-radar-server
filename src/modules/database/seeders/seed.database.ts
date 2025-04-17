import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AdminConfigRepository, UserRepository } from '../repositories';

@Injectable()
export class SeedDatabase implements OnApplicationBootstrap {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(AdminConfigRepository)
  private readonly adminConfigRepository: AdminConfigRepository;

  constructor() {}

  async seedLatestBlock() {
    const latestBlock =
      await this.adminConfigRepository.findByKey('latest_block');

    if (!latestBlock) {
      await this.adminConfigRepository.setConfig('latest_block', '0', {
        is_stop: true,
      });
      console.log('Latest block config seeded');
    }
  }

  async seedConfigAPY() {
    const configAPY = await this.adminConfigRepository.findByKey('config_apy');

    if (!configAPY) {
      await this.adminConfigRepository.setConfig('config_apy', '0');
      console.log('Config APY config seeded');
    }
  }

  async seedConfigSnapshotReward() {
    const configSnapshotReward = await this.adminConfigRepository.findByKey(
      'config_snapshot_reward',
    );

    if (!configSnapshotReward) {
      await this.adminConfigRepository.setConfig(
        'config_snapshot_reward',
        'end',
        {
          is_stop: true,
          snap_time: new Date(),
          epoch_time: 4 * 60 * 60 * 1000, //4 hours
        },
      );
      console.log('Config Snapshot Reward config seeded');
    }
  }

  async onApplicationBootstrap() {
    const isWorker = Boolean(Number(process.env.IS_WORKER || 0));
    if (!isWorker) {
      return;
    }
    const start = Date.now();

    const end = Date.now();

    console.log('Time to seed database', (end - start) / 1000);

    await this.seedLatestBlock();
    await this.seedConfigAPY();
    await this.seedConfigSnapshotReward();
    console.log('-----------SEED DATABASE SUCCESSFULLY----------------');
  }
}
