import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { ServiceRepository } from './service.repository';
import { CommonUtil } from '../../utils/common.util';
import { ServiceStatus, UserRole } from '../../common/constants/app.constant';
import { UpdateServiceDto } from './dto/update-service.req';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(private serviceRepo: ServiceRepository) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async getService(categoryId: number): Promise<ResponseDto<any>> {
    try {
      const data = await this.serviceRepo.repo.find({
        where: { status: ServiceStatus.ACTIVE, categoryId },
        order: { id: 'ASC' },
      });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(ServiceRepository.name, error);
    }
  }

  async getAdminService(categoryId: number): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      if (authInfo.role === UserRole.USER) {
        return ResponseDto.responseError(
          ServiceRepository.name,
          ErrorMap.PERMISSION_DENIED,
        );
      }
      const data = await this.serviceRepo.repo.find({
        where: { categoryId },
        order: { id: 'ASC' },
      });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(ServiceRepository.name, error);
    }
  }

  async updateServiceStatus(id: number): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      if (authInfo.role === UserRole.USER) {
        return ResponseDto.responseError(
          ServiceRepository.name,
          ErrorMap.PERMISSION_DENIED,
        );
      }

      const service = await this.serviceRepo.repo.findOne({ where: { id } });
      let status: number;
      service.status === ServiceStatus.ACTIVE
        ? status = ServiceStatus.INACTIVE
        : status = ServiceStatus.ACTIVE;
      const result = await this.serviceRepo.repo.update(
        { id },
        { status },
      );

      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      return ResponseDto.responseError(ServiceRepository.name, error);
    }
  }

  async updateService(
    id: number,
    body: UpdateServiceDto,
  ): Promise<ResponseDto<any>> {
    try {
      const service = await this.serviceRepo.repo.findOne({ where: { id } });
      if (!service) {
        return ResponseDto.responseError(
          ServiceRepository.name,
          ErrorMap.SERVICE_NOT_FOUND,
        );
      }

      const { name, sourceAddress, price, rate, apiKey } = body;

      await this.serviceRepo.repo.update(
        { id },
        { name, sourceAddress, price, rate, apiKey },
      );
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      return ResponseDto.responseError(ServiceRepository.name, error);
    }
  }
}
