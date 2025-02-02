import { Body, Controller, Logger, Param, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { OrderService } from './order.service';
import {
  CommonAuthGet,
  CommonAuthPost,
  CommonAuthPut,
  Roles,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { AdminGetOrderRequestDto } from './dto/request/admin-get-order.dto';
import { UserRole } from '../../common/constants/app.constant';
import { ExportCsvOrderDto } from './dto/request/export-csv.req';
import { Response } from 'express';

@Controller(CONTROLLER_CONSTANTS.ORDER)
@ApiTags(CONTROLLER_CONSTANTS.ORDER)
export class OrderController {
  public readonly logger = new Logger(OrderController.name);

  constructor(private orderService: OrderService) {}
  @CommonAuthPost({
    url: 'user/create',
    summary: 'create order',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'create order',
      schema: {},
    },
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseDto<any>> {
    return this.orderService.createOrder(createOrderDto);
  }

  @CommonAuthGet({
    url: 'user/history',
    summary: 'get user order',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'get user order',
      schema: {},
    },
  })
  async getUserOrder(@Query() query: AdminGetOrderRequestDto) {
    this.logger.log('========== Get user order ==========');
    return this.orderService.getUserOrder(query);
  }

  @CommonAuthGet({
    url: 'admin/get',
    summary: 'admin get order',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'admin get order',
      schema: {},
    },
  })
  @Roles(UserRole.ADMIN)
  async adminGetOrder(@Query() query: AdminGetOrderRequestDto) {
    this.logger.log('========== Admin get order ==========');
    return this.orderService.adminGetOrder(query);
  }

  @CommonAuthPut({
    url: 'admin/update/:id',
    summary: 'admin update order status',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'admin update order status',
      schema: {},
    },
  })
  @Roles(UserRole.ADMIN)
  async adminUpdateOrderStatus(@Param('id') id: string) {
    this.logger.log('========== Admin update order status ==========');
    return this.orderService.adminUpdateOrder(id);
  }

  @CommonAuthGet({
    url: 'admin/exportHistory',
    summary: 'admin export order history',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'admin export order history',
      schema: {},
    },
  })
  async exportTopupHistory(
    @Query() query: ExportCsvOrderDto,
    @Res() res: Response,
  ) {
    try {
      const csvBuffer = await this.orderService.generateCsv(query);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=orderHistory.csv',
      );
  
      res.send(csvBuffer);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).send('An error occurred while exporting CSV');
    }
  }
}
