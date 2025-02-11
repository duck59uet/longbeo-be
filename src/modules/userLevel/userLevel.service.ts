import { Injectable, Logger } from '@nestjs/common';
import { UserLevelRepository } from './userLevel.repository';
import { CommonUtil } from '../../utils/common.util';

@Injectable()
export class UserLevelService {
  private readonly logger = new Logger(UserLevelService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(private userLevelRepo: UserLevelRepository) {
    this.logger.log('============== Constructor UserLevel Service ==============');
  }
}
