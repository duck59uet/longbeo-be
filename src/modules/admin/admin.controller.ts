import { Body, Controller, Logger, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
  URL_CONSTANTS,
} from '../../common/constants/api.constant';
import {
  CommonAuthDelete,
  CommonAuthGet,
  CommonAuthPost,
  CommonPost,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { AdminService } from './admin.service';
import { ChangePasswordDto } from './dto/request/change-password';
import { CreateAdminDto } from './dto/request/create-admin.req';
import { DeleteAdminRequestDto } from './dto/request/delete-admin.req';

@Controller(CONTROLLER_CONSTANTS.ADMIN)
@ApiTags(CONTROLLER_CONSTANTS.ADMIN)
export class AdminController {
  public readonly logger = new Logger(AdminController.name);

  constructor(private adminService: AdminService) {}

  @CommonAuthGet({
    url: '',
    summary: 'Get admin info',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Admin detail',
      schema: {},
    },
  })
  async getUserInfo() {
    this.logger.log('========== Get admin info ==========');
    return this.adminService.getAdminInfo();
  }

  @CommonAuthPost({
    url: URL_CONSTANTS.CREATE_USER,
    summary: 'Create admin',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'create admin',
      schema: {},
    },
  })
  async createAdmin(@Body() body: CreateAdminDto) {
    this.logger.log('========== create new admin ==========');
    return this.adminService.createAdmin(body);
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
    return this.adminService.changePassword(body);
  }

  @CommonAuthGet({
    url: URL_CONSTANTS.LIST_ADMIN,
    summary: 'List admin',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'List admin',
      schema: {},
    },
  })
  async listAdmin() {
    this.logger.log('========== List admin ==========');
    return this.adminService.listAdmin();
  }

  @CommonAuthPost({
    url: URL_CONSTANTS.DELETE,
    summary: 'Delete admin',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Delete admin',
      schema: {},
    },
  })
  async deteleAdmin(@Body() req: DeleteAdminRequestDto) {
    this.logger.log('========== Delete admin ==========');
    return this.adminService.deleteAdmin(req);
  }
}
