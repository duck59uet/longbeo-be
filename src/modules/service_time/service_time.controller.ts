import { Body, Controller, Logger, Param, Query } from '@nestjs/common';
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
import { GetServiceTimeDto } from './dto/get-service-time.dto';

@Controller(CONTROLLER_CONSTANTS.SERVICE_TIME)
@ApiTags(CONTROLLER_CONSTANTS.SERVICE_TIME)
export class ServiceTimeController {
  public readonly logger = new Logger(ServiceTimeController.name);

  constructor(private serviceTimeService: ServiceTimeService) {}

  @CommonGet({
    url: 'getServiceTime',
    summary: 'Get all services times',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'Get all services times',
      schema: {},
    },
  })
  async getServiceTime(
    @Query() query: GetServiceTimeDto
  ): Promise<ResponseDto<any>> {
    return this.serviceTimeService.getServiceTimes(query);
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

  @CommonGet({
    url: 'get service time with service id',
    summary: 'get service time with service id',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'get service time with service id',
      schema: {},
    },
  })
  async getServiceTimeWithServiceId(
    @Param('serviceId') serviceId: number,
  ): Promise<ResponseDto<any>> {
    return this.serviceTimeService.getServiceTimeWithServiceId(serviceId);
  }
}
