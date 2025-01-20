import { Body, Controller, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { ServiceTimeService } from './service_time.service';
import {
  CommonAuthPost,
  CommonAuthPut,
  CommonGet,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { UpdateServiceTimeDto } from './dto/update-service-time.req';
import { CreateServiceTimeDto } from './dto/create-service-time.req';

@Controller(CONTROLLER_CONSTANTS.SERVICE_TIME)
@ApiTags(CONTROLLER_CONSTANTS.SERVICE_TIME)
export class ServiceTimeController {
  public readonly logger = new Logger(ServiceTimeController.name);

  constructor(private serviceTimeService: ServiceTimeService) {}

  @CommonGet({
    url: ':categoryId',
    summary: 'Get all services times',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Get all services times',
      schema: {},
    },
  })
  async getService(
    @Param('serviceId') serviceId: number,
  ): Promise<ResponseDto<any>> {
    return this.serviceTimeService.getServiceTimes(serviceId);
  }

  @CommonAuthPut({
    url: ':id',
    summary: 'Update service time',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Update service time',
      schema: {},
    },
  })
  async updateService(
    @Param('id') id: number,
    @Body() body: UpdateServiceTimeDto,
  ): Promise<ResponseDto<any>> {
    return this.serviceTimeService.updateServiceTime(id, body);
  }

  @CommonAuthPost({
    summary: 'Create service time',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Create service time',
      schema: {},
    },
  })
  async createService(
    @Body() body: CreateServiceTimeDto,
  ): Promise<ResponseDto<any>> {
    return this.serviceTimeService.createServiceTime(body);
  }
}
