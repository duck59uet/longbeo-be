import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { AdminRepository } from './admin.repository';
import { TopupModule } from '../topup/topup.module';
import { OrderModule } from '../order/order.module';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    forwardRef(() => TopupModule),
    forwardRef(() => OrderModule),
    forwardRef(() => BalanceModule),
  ],
  controllers: [AdminController],
  providers: [AdminService,  AdminRepository],
  exports: [AdminRepository],
})
export class AdminModule {}
