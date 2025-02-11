import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { UserLevelService } from './userLevel.service';

@Controller(CONTROLLER_CONSTANTS.USER_LEVEL)
@ApiTags(CONTROLLER_CONSTANTS.USER_LEVEL)
export class UserLevelController {
  public readonly logger = new Logger(UserLevelController.name);

  constructor(private userLevelService: UserLevelService) {}
}
