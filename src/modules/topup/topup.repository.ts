import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topup } from './entities/topup.entity';
import { CreateTopupDto } from './dto/request/topup.dto';

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
    topup.payment_method = createOrderDto.payment_method;
    topup.payment_code = createOrderDto.payment_code;
    topup.sender = createOrderDto.sender;
    topup.content = createOrderDto.content;
    topup.status = createOrderDto.status;

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

  async getTopupById(id: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('topup')
      .where('topup.user_id = :id', { id })
      .select('SUM(topup.amount)', 'total')
      .execute();
    return result[0].total;
  }
}
