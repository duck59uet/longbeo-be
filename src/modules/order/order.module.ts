import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from './order.repository';
import { UserModule } from '../user/user.module';
import { ServiceModule } from '../service/service.module';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [UserModule, ServiceModule, BalanceModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository]
})
export class OrderModule {}
