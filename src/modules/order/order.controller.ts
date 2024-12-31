import { Body, Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
} from '../../common/constants/api.constant';
import { OrderService } from './order.service';
import {
  CommonAuthPost,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';

@Controller(CONTROLLER_CONSTANTS.ORDER)
@ApiTags(CONTROLLER_CONSTANTS.ORDER)
export class OrderController {
  public readonly logger = new Logger(OrderController.name);

  constructor(private orderService: OrderService) {}
  @CommonAuthPost({
    url: 'order',
    summary: 'user create order while buy/sell zcoin',
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

  @CommonAuthPost({
    url: 'update',
    summary: 'admin update order',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'admin update order',
      schema: {},
    },
  })
  async updateOrder(@Body() body: UpdateOrderDto) {
    this.logger.log('========== Edit user info ==========');
    return this.orderService.updateOrder(body);
  }
}
