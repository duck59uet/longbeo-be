import { Injectable, Logger } from '@nestjs/common';
import { CommonUtil } from '../../utils/common.util';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor() {
    this.logger.log('============== Constructor API Service ==============');
  }

  async apiForSale(): Promise<any> {
    try {
      
      // return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      // return ResponseDto.responseError(AdminService.name, error);
    }
  }
}
