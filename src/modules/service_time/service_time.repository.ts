import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceTime } from './entities/service_time.entity';

@Injectable()
export class ServiceTimeRepository {
  private readonly logger = new Logger(ServiceTimeRepository.name);

  constructor(
    @InjectRepository(ServiceTime)
    public repo: Repository<ServiceTime>,
  ) {
    this.logger.log(
      '============== Constructor ServiceTime Repository ==============',
    );
  }
}
