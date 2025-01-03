import { Module } from '@nestjs/common';
import { OrderController } from './topup.controller';
import { OrderService } from './topup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/topup.entity';
import { OrderRepository } from './topup.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository]
})
export class OrderModule {}
