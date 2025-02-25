import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceTime } from './entities/service_time.entity';
import { Service } from '../service/entities/service.entity';
import { Category } from '../category/entities/category.entity';
import { ServiceStatus } from '../../common/constants/app.constant';

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

  async getServiceTimes(
    categoryId: number,
    limit: number,
    page: number,
    serviceId?: number,
  ) {
    const sql = this.repo
      .createQueryBuilder('service_time')
      .innerJoin(Service, 'service', 'service.id = service_time.serviceId')
      .where('service.categoryId = :categoryId', { categoryId })
      .andWhere('service_time.deletedAt IS NULL')
      .orderBy('service_time.time', 'ASC')
      .select([
        'service_time.id as id',
        'service_time.serviceId as "serviceId"',
        'service_time.time as time',
        'service_time.sourceServiceId as "sourceServiceId"',
        'service.name as "serviceName"',
        'service.sourceAddress as "sourceAddress"',
      ]);

    if (serviceId) {
      sql.andWhere('service_time.serviceId = :serviceId', { serviceId });
    }

    const [count, item] = await Promise.all([
      sql.getCount(),
      sql
        .limit(limit)
        .offset((page - 1) * limit)
        .execute(),
    ]);

    return [count, item];
  }

  async availableTime() {
    const sql = this.repo
      .createQueryBuilder('service_time')
      .innerJoin(Service, 'service', 'service.id = service_time.serviceId')
      .innerJoin(Category, 'category', 'category.id = service.categoryId')
      .where('service_time.deletedAt IS NULL')
      .andWhere('service.deletedAt IS NULL')
      .andWhere('service.status = :status', { status: ServiceStatus.ACTIVE })
      .andWhere('category.deletedAt IS NULL')
      .select([
        'service_time.id as id',
        'service_time.time as time',
        'service.name as "serviceName"',
        'service.price as "price"',
        'category.name as "categoryName"',
      ]);
    return sql.execute();
  }

  async getServices() {
    const sql = this.repo
      .createQueryBuilder('service_time')
      .innerJoin(Service, 'service', 'service.id = service_time.serviceId')
      .innerJoin(Category, 'category', 'category.id = service.categoryId')
      .where('service_time.deletedAt IS NULL')
      .andWhere('service.deletedAt IS NULL')
      .andWhere('category.deletedAt IS NULL')
      .select([
        'service_time.id as id',
        'service_time.time as time',
        'service.name as "serviceName"',
        'service.price as "rate"',
        'category.name as "category"',
      ]);
    return sql.execute
  }
}
