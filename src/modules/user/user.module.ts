import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { TopupModule } from '../topup/topup.module';
import { OrderModule } from '../order/order.module';
import { BalanceModule } from '../balance/balance.module';
import { UserLevelModule } from '../userLevel/userLevel.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TopupModule),
    forwardRef(() => OrderModule),
    forwardRef(() => BalanceModule),
    forwardRef(() => UserLevelModule),
  ],
  controllers: [UserController],
  providers: [UserService,  UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
