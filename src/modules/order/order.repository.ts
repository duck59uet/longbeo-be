import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { Service } from '../service/entities/service.entity';
import { OrderStatus } from '../../common/constants/app.constant';
import { User } from '../user/entities/user.entity';
import { AdminGetOrderRequestDto } from './dto/request/admin-get-order.dto';
import { GetOrderRequestDto } from './dto/request/get-order.req';
import { Category } from '../category/entities/category.entity';

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
    amount: number,
    serviceId: number,
    serviceTimeId: number,
    createOrderDto: CreateOrderDto,
    price: number,
    userId: string,
    discount: number,
  ): Promise<Order> {
    const order = new Order();
    order.user_id = userId;
    order.amount = amount;
    order.service_id = serviceId;
    order.service_time_id = serviceTimeId;
    order.link = createOrderDto.link;
    order.quantity = createOrderDto.quantity;
    order.price = price;
    order.discount = discount;
    order.status = OrderStatus.PENDING;
    return await this.repo.save(order);
  }

  async getUserOrder(userId: string, query: AdminGetOrderRequestDto) {
    const { categoryId, page, limit } = query;

    const sql = this.repo
      .createQueryBuilder('order')
      .innerJoin(Service, 'service', 'service.id = order.service_id')
      .where('order.user_id = :userId', { userId })
      .andWhere('service.categoryId = :categoryId', { categoryId })
      .select([
        'order.id',
        'order.quantity',
        'order.amount',
        'order.price',
        'order.discount',
        'order.createdAt',
        'order.link',
        'order.status',
        'order.note',
        'service.name',
        'service.price',
      ]);

    const [count, item] = await Promise.all([
      sql.getCount(),
      sql
        .limit(limit)
        .offset((page - 1) * limit)
        .execute(),
    ]);

    return [count, item];
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
        'order.discount',
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
      sql
        .limit(limit)
        .offset((page - 1) * limit)
        .execute(),
    ]);

    return [count, item];
  }

  async adminGetOrderFull(query: GetOrderRequestDto) {
    const { search, page, limit } = query;
    const sql = this.repo
      .createQueryBuilder('order')
      .innerJoin(Service, 'service', 'service.id = order.service_id')
      .innerJoin(Category, 'category', 'category.id = service.categoryId')
      .innerJoin(User, 'user', 'user.id = order.user_id')
      .orderBy('order.createdAt', 'DESC')
      .select([
        'order.id as id',
        'order.quantity as quantity',
        'order.amount as amount',
        'order.price as price',
        'order.discount as discount',
        'order.createdAt as "createdAt"',
        'order.link as link',
        'order.status as status',
        'order.note as note',
        'user.id as userId',
        'user.username as username',
        'user.fullname as fullname',
        'service.name as "serviceName"',
        'service.price as "servicePrice"',
        'category.name as "categoryName"',
      ]);
    
    if(search) {
      sql.andWhere('order.link ilike :search or user.username ilike :search OR user.fullname ilike :search OR service.name ilike :search', { search: `%${search}%` });
    }

    const [count, item] = await Promise.all([
      sql.getCount(),
      sql
        .limit(limit)
        .offset((page - 1) * limit)
        .execute(),
    ]);

    return [count, item];
  }

  async exportOrderHistory(startDate: Date, endDate: Date, categoryId: number) {
    const sql = this.repo
      .createQueryBuilder('order')
      .innerJoin(Service, 'service', 'service.id = order.service_id')
      .innerJoin(User, 'user', 'user.id = order.user_id')
      .where('service.categoryId = :categoryId', { categoryId })
      .andWhere('order.createdAt >= :startDate', { startDate })
      .andWhere('order.createdAt <= :endDate', { endDate })
      .select([
        'order.quantity as quantity',
        'order.amount as amount',
        'order.price as price',
        'order.discount as discount',
        'order.createdAt as "createdAt"',
        'order.link as link',
        'order.status as status',
        'user.username as username',
        'user.fullname as fullname',
        'service.name as "serviceName"',
        'service.price as "servicePrice"',
      ]);

    return sql.execute();
  }

  async getUserOrderById(id: string, userId: string) {
    const sql = this.repo
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .andWhere('order.user_id = :userId', { userId })
      .select([
        'order.id',
        'order.quantity',
        'order.amount',
        'order.price',
        'order.createdAt',
        'order.link',
        'order.status',
        'order.note',
      ]);
    return sql.execute();
  }
}
