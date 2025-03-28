import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topup } from './entities/topup.entity';
import { CreateTopupDto } from './dto/request/topup.dto';
import { Admin } from '../admin/entities/admin.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TopupRepository {
  private readonly logger = new Logger(TopupRepository.name);

  constructor(
    @InjectRepository(Topup)
    public repo: Repository<Topup>,
  ) {
    this.logger.log(
      '============== Constructor Topup Repository ==============',
    );
  }

  async createTopup(
    createOrderDto: CreateTopupDto,
    userId: string,
  ): Promise<Topup> {
    const topup = new Topup();
    topup.user_id = createOrderDto.user_id;
    topup.amount = createOrderDto.amount;
    topup.admin_id = userId;
    topup.sender = createOrderDto.sender;

    return await this.repo.save(topup);
  }

  async getUserTopupHistory(
    userId: string,
    limit: number,
    page: number,
  ): Promise<[number, Topup[]]> {
    const [itemCount, data] = await Promise.all([
      this.repo.count({ where: { user_id: userId } }),
      this.repo
        .createQueryBuilder('topup')
        .where('topup.user_id = :userId', { userId })
        .skip(limit * (page - 1))
        .take(limit)
        .getMany(),
    ]);

    return [itemCount, data];
  }

  async getAdminTopupHistory(limit: number, page: number) {
    const sql = this.repo
      .createQueryBuilder('topup')
      .innerJoin(Admin, 'admin', 'admin.id = topup.admin_id')
      .innerJoin(User, 'user', 'user.id = topup.user_id')
      .select([
        'user.username',
        'user.fullname',
        'topup.id',
        'topup.amount',
        'topup.createdAt',
        'topup.sender',
        'admin.fullname',
      ])
      .orderBy('topup.createdAt', 'DESC');

    const [itemCount, data] = await Promise.all([
      sql.getCount(),
      sql
        .limit(limit)
        .offset((page - 1) * limit)
        .execute(),
    ]);

    return [itemCount, data];
  }

  async getTopupById(id: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('topup')
      .where('topup.user_id = :id', { id })
      .select('SUM(topup.amount)', 'total')
      .execute();
    return result[0].total;
  }

  async exportTopupHistory(startDate: Date, endDate: Date) {
    return this.repo
      .createQueryBuilder('topup')
      .leftJoin(Admin, 'admin', 'admin.id = topup.admin_id')
      .leftJoin(User, 'user', 'user.id = topup.user_id')
      .select([
        'user.username as username',
        'user.fullname as fullname',
        'topup.amount as amount',
        'topup.createdAt as "createdAt"',
        'topup.sender as sender',
        'admin.fullname as admin',
      ])
      .where('topup.createdAt >= :startDate', { startDate })
      .andWhere('topup.createdAt <= :endDate', { endDate })
      .execute();
  }
}
