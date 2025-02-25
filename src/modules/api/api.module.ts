import { forwardRef, Module } from '@nestjs/common';

import { TopupModule } from '../topup/topup.module';
import { OrderModule } from '../order/order.module';
import { BalanceModule } from '../balance/balance.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ServiceTimeModule } from '../service_time/service_time.module';
import { ServiceModule } from '../service/service.module';
import { UserModule } from '../user/user.module';
import { UserLevelModule } from '../userLevel/userLevel.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TopupModule,
    OrderModule,
    BalanceModule,
    ServiceTimeModule,
    ServiceModule,
    UserModule,
    UserLevelModule,
    TelegramModule
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [],
})
export class ApiModule {}
