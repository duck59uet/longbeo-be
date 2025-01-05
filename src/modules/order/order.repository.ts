import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { Service } from '../service/entities/service.entity';
import { OrderStatus } from '../../common/constants/app.constant';

@Injectable()
export class OrderRepository {
  private readonly logger = new Logger(OrderRepository.name);

  constructor(
    @InjectRepository(Order)
    public repo: Repository<Order>,
  ) {
    this.logger.log(
      '============== Constructor Order Repository ==============',
    );
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    price: number,
    userId: string,
  ): Promise<Order> {
    const order = new Order();
    order.user_id = userId;
    order.link = createOrderDto.link;
    order.quantity = createOrderDto.quantity;
    order.amount = createOrderDto.amount;
    order.price = price;
    order.service_id = createOrderDto.service_id;
    order.status = OrderStatus.COMPLETE;
    return await this.repo.save(order);
  }

  async getUserOrder(userId: string) {
    const result = await this.repo
      .createQueryBuilder('order')
      .innerJoin(Service, 'service', 'service.id = order.service_id')
      .where('order.user_id = :userId', { userId })
      .select([
        'order.id as "orderId"',
        'order.quantity as "orderQuantity"',
        'order.amount as "orderAmount"',
        'order.price as "orderPrice"',
        'order.createdAt as "createdAt"',
        'order.link as "orderLink"',
        'order.note as "orderNote"',
        'service.name as "serviceName"',
        'service.price as "servicePrice"',
      ])
      .execute();

    return result;
  }

  async getOrderById(userId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('order')
      .where('order.user_id = :id', { id: userId })
      .select('SUM(order.amount)', 'total')
      .execute();

    return result[0].total;
  }
}
