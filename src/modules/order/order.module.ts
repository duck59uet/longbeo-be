import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from './order.repository';
import { UserModule } from '../user/user.module';
import { ServiceModule } from '../service/service.module';
import { BalanceModule } from '../balance/balance.module';
import { OrderProcessor } from './order.processor';
import { ServiceTimeModule } from '../service_time/service_time.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() =>ServiceModule),
    forwardRef(() => BalanceModule),
    forwardRef(() => ServiceTimeModule),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderProcessor],
  exports: [OrderRepository],
})
export class OrderModule {}
