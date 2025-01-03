import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { TopupRepository } from './topup.repository';
import { CommonUtil } from '../../utils/common.util';
import { CreateTopupDto } from './dto/request/topup.dto';
import { BalanceRepository } from '../balance/balance.repository';

@Injectable()
export class TopupService {
  private readonly logger = new Logger(TopupService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private topUpRepo: TopupRepository,
    private balanceRepo: BalanceRepository,
  ) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async createTopup(createTopupDto: CreateTopupDto): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();

      const data = await this.topUpRepo.createTopup(
        createTopupDto,
        authInfo.id,
      );

      await this.balanceRepo.updateBalance({
        user_id: createTopupDto.user_id,
        amount: createTopupDto.amount,
      });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(TopupService.name, error);
    }
  }
}
