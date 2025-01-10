import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceRepository {
  private readonly logger = new Logger(ServiceRepository.name);

  constructor(
    @InjectRepository(Service)
    public repo: Repository<Service>,
  ) {
    this.logger.log(
      '============== Constructor Service Repository ==============',
    );
  }
}
