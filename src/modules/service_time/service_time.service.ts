import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { ServiceTimeRepository } from './service_time.repository';
import { CommonUtil } from '../../utils/common.util';
import { UpdateServiceTimeDto } from './dto/update-service-time.req';
import { CreateServiceTimeDto } from './dto/create-service-time.req';
import { ServiceTime } from './entities/service_time.entity';

@Injectable()
export class ServiceTimeService {
  private readonly logger = new Logger(ServiceTimeService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private serviceTimeRepo: ServiceTimeRepository,
  ) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async getServiceTimes(serviceId: number): Promise<ResponseDto<any>> {
    try {
      const data = await this.serviceTimeRepo.repo.find({ where: { serviceId }, order: { id: 'ASC' } });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(ServiceTimeService.name, error);
    }
  }

  async updateServiceTime(id: number, body: UpdateServiceTimeDto): Promise<ResponseDto<any>> {
    try {
      const service = await this.serviceTimeRepo.repo.findOne({ where: { id } });
      if (!service) {
        return ResponseDto.responseError(ServiceTimeService.name, ErrorMap.SERVICE_NOT_FOUND);
      }

      const { sourceServiceId } = body;

      await this.serviceTimeRepo.repo.update({ id }, { sourceServiceId });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      return ResponseDto.responseError(ServiceTimeService.name, error);
    }
  }

  async createServiceTime(body: CreateServiceTimeDto): Promise<ResponseDto<any>> {
    try {
      const { serviceId, sourceServiceId } = body;
      await this.serviceTimeRepo.repo.save({ serviceId, sourceServiceId });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      return ResponseDto.responseError(ServiceTimeService.name, error);
    }
  }
}
