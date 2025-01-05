import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { OrderRepository } from './order.repository';
import { CommonUtil } from '../../utils/common.util';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UserRole } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { UpdateOrderDto } from './dto/request/update-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private orderRepo: OrderRepository,
    private userRepo: UserRepository,
  ) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();

      const data = await this.orderRepo.createOrder(
        createOrderDto,
        authInfo.id,
      );
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(OrderService.name, error);
    }
  }

  async getUserOrder(): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      const data = await this.orderRepo.getUserOrder(authInfo.id);

      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(OrderService.name, error);
    }
  }
}
