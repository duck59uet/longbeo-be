import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from './order.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository]
})
export class OrderModule {}
