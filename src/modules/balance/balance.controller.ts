import { Body, Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
} from '../../common/constants/api.constant';
import { BalanceService } from './balance.service';
import {
  CommonAuthPost,
  Roles,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { UserRole } from '../user/entities/user.entity';
import { CreateBalanceDto } from './dto/balance.dto';

@Controller(CONTROLLER_CONSTANTS.BALANCE)
@ApiTags(CONTROLLER_CONSTANTS.BALANCE)
export class BalanceController {
  public readonly logger = new Logger(BalanceController.name);

  constructor(private balanceService: BalanceService) {}
  

}
