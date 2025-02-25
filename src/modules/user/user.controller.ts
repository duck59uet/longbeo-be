import { Body, Controller, Logger, Param, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
  URL_CONSTANTS,
} from '../../common/constants/api.constant';
import {
  CommonAuthGet,
  CommonAuthPost,
  CommonPost,
  Roles,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.req';
import { UpdateUserDto } from './dto/request/update-user.req';
import { ChangePasswordDto } from './dto/request/change-password';
import { AdminGetUsersRequestDto } from './dto/request/admin-get-user.req';
import { Response } from 'express';
import { UserIdRequestDto } from './dto/request/user-id.req';
import { GetUserPathParamDto } from './dto/request/get-user.req';

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
  async updateUser(@Body() body: UpdateUserDto) {
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
  async changePassword(@Body() body: ChangePasswordDto) {
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

  @CommonAuthGet({
    url: 'admin/getUsers',
    summary: 'admin get users',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'admin get order',
      schema: {},
    },
  })
  // @Roles(UserRole.ADMIN)
  async adminGetUser(@Query() query: AdminGetUsersRequestDto) {
    this.logger.log('========== Admin get users ==========');
    return this.userService.adminGetUsers(query);
  }

  @CommonAuthGet({
    url: 'admin/exportUser',
    summary: 'admin export user list',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'admin export user list',
      schema: {},
    },
  })
  async exportUserList(@Res() res: Response) {
    try {
      const csvBuffer = await this.userService.generateCsv();

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=userList.csv');

      res.send(csvBuffer);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).send('An error occurred while exporting CSV');
    }
  }

  @CommonAuthPost({
    url: URL_CONSTANTS.DELETE,
    summary: 'Delete user',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Delete user',
      schema: {},
    },
  })
  async deteleAdmin(@Body() req: UserIdRequestDto) {
    this.logger.log('========== Delete user ==========');
    return this.userService.deleteUser(req);
  }

  @CommonAuthPost({
    url: URL_CONSTANTS.UPDATE_USER_LEVEL,
    summary: 'Update user level',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Update user level',
      schema: {},
    },
  })
  async updateUserLevel(@Body() req: GetUserPathParamDto) {
    this.logger.log('========== Update user level ==========');
    return this.userService.updateUserLevel(req);
  }

  @CommonAuthPost({
    url: URL_CONSTANTS.GENERATE_API_KEY,
    summary: 'Generate API key',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Generate API key',
      schema: {},
    },
  })
  async generateApiKey(@Body() req: UserIdRequestDto) {
    this.logger.log('========== Generate API key ==========');
    return this.userService.generateApiKey(req);
  }
}
