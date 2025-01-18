import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { Service } from '../service/entities/service.entity';
import { OrderStatus } from '../../common/constants/app.constant';
import { User } from '../user/entities/user.entity';
import { AdminGetOrderRequestDto } from './dto/request/admin-get-order.dto';

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
    order.status = OrderStatus.PENDING;
    return await this.repo.save(order);
  }

  async getUserOrder(userId: string, id: string) {
    const serviceIds = id.split(',').map((item) => Number(item));

    const result = await this.repo
      .createQueryBuilder('order')
      .innerJoin(Service, 'service', 'service.id = order.service_id')
      .where('order.user_id = :userId', { userId })
      .andWhere('order.service_id IN (:...serviceIds)', { serviceIds })
      .select([
        'order.id',
        'order.quantity',
        'order.amount',
        'order.price',
        'order.createdAt',
        'order.link',
        'order.note',
        'service.name',
        'service.price',
      ])
      .execute();

    return result;
  }

  async getOrderById(userId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('order')
      .where('order.user_id = :id', { id: userId })
      .select('SUM(order.price)', 'total')
      .execute();

    return result[0].total;
  }

  async adminGetOrder(query: AdminGetOrderRequestDto) {
    const { categoryId, page, limit } = query;
    const sql = this.repo
      .createQueryBuilder('order')
      .innerJoin(Service, 'service', 'service.id = order.service_id')
      .innerJoin(User, 'user', 'user.id = order.user_id')
      .orderBy('order.createdAt', 'DESC')
      .where('service.categoryId = :categoryId', { categoryId })
      .select([
        'order.id',
        'order.quantity',
        'order.amount',
        'order.price',
        'order.createdAt',
        'order.link',
        'order.status',
        'order.note',
        'user.id',
        'user.username',
        'user.fullname',
        'service.name',
        'service.price',
      ]);

    const [count, item] = await Promise.all([
      sql.getCount(),
      sql.limit(limit).offset((page - 1) * limit).execute(),
    ]);

    return [count, item];
  }
}
