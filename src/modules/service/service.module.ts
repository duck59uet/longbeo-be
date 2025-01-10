import { Module } from '@nestjs/common';
import { BalanceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRepository } from './service.repository';
import { Service } from './entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [BalanceController],
  providers: [ServiceService, ServiceRepository],
  exports: [ServiceRepository]
})
export class ServiceModule {}
