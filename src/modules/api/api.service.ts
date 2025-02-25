import { Injectable, Logger } from '@nestjs/common';
import { CommonUtil } from '../../utils/common.util';
import { ApiDto } from './dto/api.req';
import { UserRepository } from '../user/user.repository';
import { ServiceRepository } from '../service/service.repository';
import { ServiceTimeRepository } from '../service_time/service_time.repository';
import { BalanceRepository } from '../balance/balance.repository';
import { OrderRepository } from '../order/order.repository';
import { TelegramService } from '../telegram/telegram.service';
import { UserLevelRepository } from '../userLevel/userLevel.repository';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private userRepo: UserRepository,
    private serviceRepo: ServiceRepository,
    private serviceTimeRepo: ServiceTimeRepository,
    private balanceRepo: BalanceRepository,
    private orderRepo: OrderRepository,
    private teleService: TelegramService,
    private userLevelRepo: UserLevelRepository,
  ) {
    this.logger.log('============== Constructor API Service ==============');
  }

  async apiForSale(body: ApiDto): Promise<any> {
    try {
      const { key, action, service, link, quantity, order, orders } = body;

      const user = await this.userRepo.repo.findOne({ where: { apiKey: key } });
      if (!user) {
        return { error: 'Invalid API key' };
      }

      if (action === 'add') {
        const services = await this.serviceTimeRepo.getServices();
        return { services };
      }

      if (action === 'service') {
        if (!service || !link || !quantity) {
          return { error: 'Invalid parameters' };
        }

        const userBalance = await this.balanceRepo.repo.findOne({
          where: { user_id: user.id },
        });

        const serviceTimeInfo = await this.serviceTimeRepo.repo.findOne({
          where: { id: service },
        });
        const server = await this.serviceRepo.repo.findOne({
          where: { id: serviceTimeInfo.serviceId },
        });
        const price = Number(
          (
            Number(server.price) *
            Number(quantity) *
            Number(serviceTimeInfo.time)
          ).toFixed(2),
        );

        let userLevel: any;
        //Lay ra discount
        if (user.level !== 1) {
          userLevel = await this.userLevelRepo.repo.findOne({
            where: { id: user.level },
          });
        }

        if (userBalance.balance < price) {
          return { error: 'Balance not enough' };
        }

        let discount = 0;
        if (userLevel) {
          discount = parseFloat(
            ((userLevel.discount * price) / 100).toFixed(2),
          );
        }

        await this.balanceRepo.repo.update(
          { user_id: user.id },
          { balance: userBalance.balance - price - discount },
        );

        const data = await this.orderRepo.createOrder(
          Number(serviceTimeInfo.time),
          serviceTimeInfo.serviceId,
          serviceTimeInfo.id,
          { link, quantity, service, note: '' },
          price,
          user.id,
          discount,
        );

        this.teleService.sendMessage(
          `Đã tạo đơn hàng mới: id: ${data.id} - Link: ${link} - ${
            user.username
          } - Server: ${server.name} - Số lượng: ${quantity} 
                - Thời gian: ${
                  serviceTimeInfo.time
                } - Thành tiền: ${price} - Giảm giá: ${discount} - Tổng tiền: ${
            price - discount
          }`,
        );

        return { order: data.id };
      }

      if (action === 'order') {
        if (!order) {
          return { error: 'Incorrect order ID' };
        }

        const data = await this.orderRepo.repo.findOne({ where: { id: order } });
        if (!data) {
          return { error: 'Incorrect order ID' };
        }
        return { charge: (data.price / 26000).toFixed(2), status: data.status, currency: 'USD' };
      }

      // return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      // return ResponseDto.responseError(AdminService.name, error);
    }
  }
}
