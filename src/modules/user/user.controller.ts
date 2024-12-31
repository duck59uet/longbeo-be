import { Body, Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
  URL_CONSTANTS,
} from '../../common/constants/api.constant';
import { CommonAuthGet, CommonAuthPost, CommonPost } from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.req';

@Controller(CONTROLLER_CONSTANTS.USER)
@ApiTags(CONTROLLER_CONSTANTS.USER)
export class UserController {
  public readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @CommonAuthGet({
    url: '',
    summary: 'Get user info',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'User detail',
      schema: {},
    },
  })
  async getUserInfo() {
    this.logger.log('========== Get user info ==========');
    return this.userService.getUserInfo();
  }

  @CommonPost({
    url: URL_CONSTANTS.CREATE_USER,
    summary: 'Create user',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'create user',
      schema: {},
    },
  })
  async createUser(@Body() body: CreateUserDto) {
    this.logger.log('========== create new user ==========');
    return this.userService.createUser(body);
  }
}
