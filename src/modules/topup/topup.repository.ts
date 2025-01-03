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

  async createTopup(createOrderDto: CreateTopupDto, userId: string): Promise<Topup> {
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
}
