import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLevel } from './entities/userLevel.entity';

@Injectable()
export class UserLevelRepository {
  private readonly logger = new Logger(UserLevelRepository.name);

  constructor(
    @InjectRepository(UserLevel)
    public repo: Repository<UserLevel>,
  ) {
    this.logger.log(
      '============== Constructor UserLevel Repository ==============',
    );
  }
}
