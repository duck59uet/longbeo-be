import { Body, Controller, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
  URL_CONSTANTS,
} from '../../common/constants/api.constant';
import {
  CommonAuthGet,
  CommonAuthPost,
  CommonPost,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.req';
import { UpdateUserDto } from './dto/request/update-user.req';
import { ChangePasswordDto } from './dto/request/change-password';

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

  @CommonAuthPost({
    url: URL_CONSTANTS.UPDATE_USER,
    summary: 'Update user',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'update user',
      schema: {},
    },
  })
  async updateUser(
    @Body() body: UpdateUserDto,
  ) {
    this.logger.log('========== update user ==========');
    return this.userService.updateUser(body);
  }

  @CommonAuthPost({
    url: URL_CONSTANTS.CHANGE_PASSWORD,
    summary: 'Change password',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Change password',
      schema: {},
    },
  })
  async changePassword(
    @Body() body: ChangePasswordDto,
  ) {
    this.logger.log('========== Change password ==========');
    return this.userService.changePassword(body);
  }

  @CommonAuthGet({
    url: '/balance',
    summary: 'Get user balance',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Get user balance',
      schema: {},
    },
  })
  async getUserBalance() {
    this.logger.log('========== Get user balance ==========');
    return this.userService.getUserBalance();
  }
}
