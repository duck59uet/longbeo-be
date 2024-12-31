import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/request/create-order.dto';

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

  async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const order = new Order();
    order.user_id = userId;
    order.amount = createOrderDto.amount;
    order.price = createOrderDto.price;
    order.service_id = createOrderDto.service_id;
    return await this.repo.save(order);
  }
}
