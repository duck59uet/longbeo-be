import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { ServiceRepository } from './service.repository';
import { CommonUtil } from '../../utils/common.util';
import { ServiceStatus } from '../../common/constants/app.constant';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private serviceRepo: ServiceRepository,
  ) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async getService(categoryId: number): Promise<ResponseDto<any>> {
    try {
      const data = await this.serviceRepo.repo.find({where: {status: ServiceStatus.ACTIVE, categoryId}});
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(ServiceRepository.name, error);
    }
  }
}
