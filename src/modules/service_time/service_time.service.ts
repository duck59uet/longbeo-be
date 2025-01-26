import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { ServiceTimeRepository } from './service_time.repository';
import { CommonUtil } from '../../utils/common.util';
import { UpdateServiceTimeDto } from './dto/update-service-time.req';
import { CreateServiceTimeDto } from './dto/create-service-time.req';
import { ServiceTime } from './entities/service_time.entity';
import { ServiceRepository } from '../service/service.repository';
import { In } from 'typeorm';
import { GetServiceTimeDto } from './dto/get-service-time.dto';
import { UserRole } from '../../common/constants/app.constant';
import { DeleteServiceTimeDto } from './dto/delete-service-time.req';

@Injectable()
export class ServiceTimeService {
  private readonly logger = new Logger(ServiceTimeService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private readonly serviceRepo: ServiceRepository,
    private serviceTimeRepo: ServiceTimeRepository,
  ) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async getServiceTimes(query: GetServiceTimeDto): Promise<ResponseDto<any>> {
    try {
      const { limit, page, categoryId } = query;

      const data = await this.serviceTimeRepo.getServiceTimes(categoryId, limit, page);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(ServiceTimeService.name, error);
    }
  }

  async updateServiceTime(
    id: number,
    body: UpdateServiceTimeDto,
  ): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      if (authInfo.role === UserRole.USER) {
        return ResponseDto.responseError(
          ServiceTimeService.name,
          ErrorMap.PERMISSION_DENIED,
        );
      }
      const service = await this.serviceTimeRepo.repo.findOne({
        where: { id },
      });
      if (!service) {
        return ResponseDto.responseError(
          ServiceTimeService.name,
          ErrorMap.SERVICE_NOT_FOUND,
        );
      }

      const { sourceServiceId, time } = body;

      await this.serviceTimeRepo.repo.update({ id }, { sourceServiceId, time });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      return ResponseDto.responseError(ServiceTimeService.name, error);
    }
  }

  async createServiceTime(
    body: CreateServiceTimeDto,
  ): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      if (authInfo.role === UserRole.USER) {
        return ResponseDto.responseError(
          ServiceTimeService.name,
          ErrorMap.PERMISSION_DENIED,
        );
      }
      const { serviceId, sourceServiceId, time } = body;
      await this.serviceTimeRepo.repo.save({ serviceId, sourceServiceId, time });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      return ResponseDto.responseError(ServiceTimeService.name, error);
    }
  }

  async getServiceTimeWithServiceId(
    serviceId: number,
  ): Promise<ResponseDto<any>> {
    try {
      const result = await this.serviceTimeRepo.repo.find({ where: { serviceId } });
      const sortedResult = result.sort((a, b) => {
        return parseInt(a.time, 10) - parseInt(b.time, 10);
      });
  
      return ResponseDto.response(ErrorMap.SUCCESSFUL, sortedResult);
    } catch (error) {
      return ResponseDto.responseError(ServiceTimeService.name, error);
    }
  }

  async deleteServiceTime(req: DeleteServiceTimeDto): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      if (authInfo.role === UserRole.USER) {
        return ResponseDto.responseError(
          ServiceTimeService.name,
          ErrorMap.PERMISSION_DENIED,
        );
      }

      await this.serviceTimeRepo.repo.softDelete({ id: req.id });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      return ResponseDto.responseError(ServiceTimeService.name, error);
    }
  }
}
