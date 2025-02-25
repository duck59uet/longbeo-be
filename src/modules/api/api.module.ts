import { forwardRef, Module } from '@nestjs/common';

import { TopupModule } from '../topup/topup.module';
import { OrderModule } from '../order/order.module';
import { BalanceModule } from '../balance/balance.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [
    forwardRef(() => TopupModule),
    forwardRef(() => OrderModule),
    forwardRef(() => BalanceModule),
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [],
})
export class ApiModule {}
