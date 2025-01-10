import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { OrderRepository } from './order.repository';
import { CommonUtil } from '../../utils/common.util';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UserRepository } from '../user/user.repository';
import { ServiceRepository } from '../service/service.repository';
import { BalanceRepository } from '../balance/balance.repository';
import { AdminGetOrderRequestDto } from './dto/request/admin-get-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private orderRepo: OrderRepository,
    private serviceRepo: ServiceRepository,
    private balanceRepo: BalanceRepository,
    private userRepo: UserRepository,
  ) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<ResponseDto<any>> {
    try {
      const { quantity, amount, service_id } = createOrderDto;

      const authInfo = this.commonUtil.getAuthInfo();
      const userBalance = await this.balanceRepo.repo.findOne({ where: { user_id: authInfo.id } });

      const server = await this.serviceRepo.repo.findOne({ where: { id: service_id } });
      const price = Number(server.price) * Number(quantity) * Number(amount);

      if (userBalance.balance < price) {
        return ResponseDto.responseError(OrderService.name, ErrorMap.BALANCE_NOT_ENOUGH);
      }

      await this.balanceRepo.repo.update({ user_id: authInfo.id }, { balance: userBalance.balance - price });

      const data = await this.orderRepo.createOrder(
        createOrderDto,
        price,
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

  async adminGetOrder(query: AdminGetOrderRequestDto): Promise<ResponseDto<any>> {
    try {
      const data = await this.orderRepo.adminGetOrder(query);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(OrderService.name, error);
    }
  }
}
