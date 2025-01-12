import { Body, Controller, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { ServiceService } from './service.service';
import {
  CommonAuthPost,
  CommonAuthPut,
  CommonGet,
  Roles,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { UpdateServiceDto } from './dto/update-service.req';
import { UserRole } from '../user/entities/user.entity';

@Controller(CONTROLLER_CONSTANTS.SERVICE)
@ApiTags(CONTROLLER_CONSTANTS.SERVICE)
export class BalanceController {
  public readonly logger = new Logger(BalanceController.name);

  constructor(private serviceService: ServiceService) {}

  @CommonGet({
    url: ':categoryId',
    summary: 'Get all services',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Get all services',
      schema: {},
    },
  })
  async getService(
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseDto<any>> {
    return this.serviceService.getService(categoryId);
  }

  @CommonAuthPut({
    url: ':id',
    summary: 'Update service',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Update service',
      schema: {},
    },
  })
  @Roles(UserRole.ADMIN)
  async updateService(
    @Param('id') id: number,
    @Body() body: UpdateServiceDto,
  ): Promise<ResponseDto<any>> {
    return this.serviceService.updateService(id, body);
  }
}
