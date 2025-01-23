import { Body, Controller, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { ServiceService } from './service.service';
import {
  CommonAuthGet,
  CommonAuthPut,
  CommonGet,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { UpdateServiceDto } from './dto/update-service.req';
import { UserRole } from '../../common/constants/app.constant';

@Controller(CONTROLLER_CONSTANTS.SERVICE)
@ApiTags(CONTROLLER_CONSTANTS.SERVICE)
export class ServiceController {
  public readonly logger = new Logger(ServiceController.name);

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

  @CommonAuthGet({
    url: 'all/:categoryId',
    summary: 'Admin get all services',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Admin get all services',
      schema: {},
    },
  })
  async getAdminService(
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseDto<any>> {
    return this.serviceService.getAdminService(categoryId);
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
  async updateService(
    @Param('id') id: number,
    @Body() body: UpdateServiceDto,
  ): Promise<ResponseDto<any>> {
    return this.serviceService.updateService(id, body);
  }

  @CommonAuthPut({
    url: 'status/:id',
    summary: 'Update service status',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Update service status',
      schema: {},
    },
  })
  async updateServiceStatus(
    @Param('id') id: number,
  ): Promise<ResponseDto<any>> {
    return this.serviceService.updateServiceStatus(id);
  }
}
