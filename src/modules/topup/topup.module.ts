import { Module } from '@nestjs/common';
import { TopupController } from './topup.controller';
import { TopupService } from './topup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topup } from './entities/topup.entity';
import { TopupRepository } from './topup.repository';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [BalanceModule, TypeOrmModule.forFeature([Topup])],
  controllers: [TopupController],
  providers: [TopupService, TopupRepository],
  exports: [TopupRepository]
})
export class TopupModule {}
