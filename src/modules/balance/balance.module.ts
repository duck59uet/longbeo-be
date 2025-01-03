import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceRepository } from './balance.repository';
import { UserModule } from '../user/user.module';
import { Balance } from './entities/balance.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Balance])],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository],
  exports: [BalanceRepository]
})
export class BalanceModule {}
