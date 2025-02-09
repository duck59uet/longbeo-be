import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { OrderRepository } from './order.repository';
import { CommonUtil } from '../../utils/common.util';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { ServiceRepository } from '../service/service.repository';
import { BalanceRepository } from '../balance/balance.repository';
import { AdminGetOrderRequestDto } from './dto/request/admin-get-order.dto';
import { OrderStatus } from '../../common/constants/app.constant';
import { unparse } from 'papaparse';
import { ExportCsvOrderDto } from './dto/request/export-csv.req';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private orderRepo: OrderRepository,
    private serviceRepo: ServiceRepository,
    private balanceRepo: BalanceRepository,
    private teleService: TelegramService,
  ) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<ResponseDto<any>> {
    try {
      const { quantity, amount, service_id, service_time_id } = createOrderDto;

      const authInfo = this.commonUtil.getAuthInfo();
      const userBalance = await this.balanceRepo.repo.findOne({
        where: { user_id: authInfo.id },
      });

      const server = await this.serviceRepo.repo.findOne({
        where: { id: service_id },
      });
      const price = Number(
        (Number(server.price) * Number(quantity) * Number(amount)).toFixed(2),
      );

      if (userBalance.balance < price) {
        return ResponseDto.responseError(
          OrderService.name,
          ErrorMap.BALANCE_NOT_ENOUGH,
        );
      }

      await this.balanceRepo.repo.update(
        { user_id: authInfo.id },
        { balance: userBalance.balance - price },
      );

      const data = await this.orderRepo.createOrder(
        createOrderDto,
        price,
        authInfo.id,
      );

      this.teleService.sendMessage(
        `Đã tạo đơn hàng mới: ${createOrderDto.link} - ${authInfo.username} - ${server.name} - ${quantity} - ${amount} - ${price}`,
      );
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(OrderService.name, error);
    }
  }

  async getUserOrder(
    query: AdminGetOrderRequestDto,
  ): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      const data = await this.orderRepo.getUserOrder(authInfo.id, query);

      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(OrderService.name, error);
    }
  }

  async adminGetOrder(
    query: AdminGetOrderRequestDto,
  ): Promise<ResponseDto<any>> {
    try {
      const data = await this.orderRepo.adminGetOrder(query);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(OrderService.name, error);
    }
  }

  async adminUpdateOrder(id: string): Promise<ResponseDto<any>> {
    try {
      await this.orderRepo.repo.update(
        { id },
        { status: OrderStatus.COMPLETE },
      );
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      return ResponseDto.responseError(OrderService.name, error);
    }
  }

  async generateCsv(query: ExportCsvOrderDto): Promise<any> {
    try {
      const { startDate, endDate, categoryId } = query;

      const data = await this.orderRepo.exportOrderHistory(startDate, endDate, categoryId);

      const csvHeaders = [
        'Tài khoản',
        'Link',
        'Máy chủ',
        'Số phút',
        'Số mặt',
        'Giá',
        'Thành tiền',
        'Thời gian'
      ];
  
      // Dữ liệu CSV
      const csvData = data.map((record: any) => ({
        'Tài khoản': record.username,
        'Link': record.link,
        'Máy chủ': record.serviceName,
        'Số phút': record.amount,
        'Số mặt': record.quantity,
        'Giá': record.servicePrice,
        'Thành tiền': record.price,
        'Thời gian': record.createdAt,
      }));
  
      // Tạo CSV string với BOM (UTF-8)
      const BOM = '\uFEFF';
      const csvContent = BOM + unparse(csvData, { header: true });
  
      return csvContent;
    } catch (error) {
      return ResponseDto.responseError(OrderService.name, error);
    }
  }
}
