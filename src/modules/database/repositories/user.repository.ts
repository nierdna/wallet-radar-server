import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class UserRepository extends Repository<User> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
