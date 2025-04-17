import { DataSource, In, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  AdminConfigData,
  AdminConfigEntity,
} from '../entities/admin-config.entity';

export class AdminConfigRepository extends Repository<AdminConfigEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(AdminConfigEntity, dataSource.createEntityManager());
  }

  async findByKey(key: string): Promise<AdminConfigEntity> {
    return this.findOne({ where: { key } });
  }

  async findByKeys(keys: string[]): Promise<AdminConfigEntity[]> {
    return this.find({ where: { key: In(keys) } });
  }

  async getConfigValue(
    key: string,
    defaultValue: string = null,
  ): Promise<string> {
    const config = await this.findByKey(key);
    return config ? config.value : defaultValue;
  }

  async getNftSaleConfig(): Promise<any> {
    const config = await this.findByKey('nft_sale');
    if (!config) return null;

    try {
      return config.data;
    } catch (error) {
      console.error('Error getting NFT sale config:', error);
      return null;
    }
  }

  async updateNftSaleCurrentId(newCurrentId: number): Promise<void> {
    const config = await this.findByKey('nft_sale');
    if (!config) return;

    try {
      if (config.data) {
        config.data.current_id = newCurrentId;
        await this.save(config);
      }
    } catch (error) {
      console.error('Error updating NFT sale current ID:', error);
    }
  }

  async setConfig(
    key: string,
    value: string,
    data?: AdminConfigData,
  ): Promise<AdminConfigEntity> {
    const config = await this.findByKey(key);

    if (config) {
      config.value = value;
      if (data) {
        config.data = data;
      }
      return this.save(config);
    } else {
      const newConfig = this.create({ key, value, data });
      return this.save(newConfig);
    }
  }
}
