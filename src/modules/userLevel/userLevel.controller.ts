import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { UserLevelService } from './userLevel.service';
import { CommonAuthGet, CommonAuthPost } from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { UpdateUserLevelDto } from './dto/update_level.req';

@Controller(CONTROLLER_CONSTANTS.USER_LEVEL)
@ApiTags(CONTROLLER_CONSTANTS.USER_LEVEL)
export class UserLevelController {
  public readonly logger = new Logger(UserLevelController.name);

  constructor(private userLevelService: UserLevelService) {}

  @CommonAuthGet({
    url: '',
    summary: 'Get all user level',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'User level',
      schema: {},
    },
  })
  async getUserLevel() {
    this.logger.log('========== Get user level ==========');
    return this.userLevelService.getUserLevel();
  }

  @CommonAuthPost({
    url: '/update',
    summary: 'Update user level',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Update user level',
      schema: {},
    },
  })
  async updateUserLevel(req: UpdateUserLevelDto) {
    this.logger.log('========== Update user level ==========');
    return this.userLevelService.updateUserLevel(req);
  }
}
