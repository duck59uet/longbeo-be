import { Module } from '@nestjs/common';
import { ServiceTimeController } from './service_time.controller';
import { ServiceTimeService } from './service_time.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTimeRepository } from './service_time.repository';
import { ServiceTime } from './entities/service_time.entity';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceTime]), ServiceModule],
  controllers: [ServiceTimeController],
  providers: [ServiceTimeService, ServiceTimeRepository],
  exports: [ServiceTimeRepository]
})
export class ServiceTimeModule {}
