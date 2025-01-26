import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { BalanceRepository } from './balance.repository';
import { CommonUtil } from '../../utils/common.util';
import { UserRepository } from '../user/user.repository';
import { CreateBalanceDto } from './dto/balance.dto';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private balanceRepo: BalanceRepository,
    private userRepo: UserRepository,
  ) {
    this.logger.log('============== Constructor Balance Service ==============');
  }

  async updateBalance(updateBalance: CreateBalanceDto): Promise<ResponseDto<any>> {
    try {
      const data = await this.balanceRepo.updateBalance(
        updateBalance,
      );
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(BalanceService.name, error);
    }
  }
}
