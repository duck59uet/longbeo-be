import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
} from '../../common/constants/api.constant';
import { BalanceService } from './balance.service';

@Controller(CONTROLLER_CONSTANTS.BALANCE)
@ApiTags(CONTROLLER_CONSTANTS.BALANCE)
export class BalanceController {
  public readonly logger = new Logger(BalanceController.name);

  constructor(private balanceService: BalanceService) {}
  
  
}
