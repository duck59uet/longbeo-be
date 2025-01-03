import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './entities/balance.entity';
import { CreateBalanceDto } from './dto/balance.dto';

@Injectable()
export class BalanceRepository {
  private readonly logger = new Logger(BalanceRepository.name);

  constructor(
    @InjectRepository(Balance)
    public repo: Repository<Balance>,
  ) {
    this.logger.log(
      '============== Constructor Balance Repository ==============',
    );
  }

  async updateBalance(createOrderDto: CreateBalanceDto): Promise<Balance> {
    try {
      const { user_id, amount } = createOrderDto;

      const isBalanceExist = await this.repo.findOne({where: {user_id}});
      if (isBalanceExist) {
        isBalanceExist.balance += amount;
        return await this.repo.save(isBalanceExist);
      } else {
        const balance = new Balance();
        balance.user_id = user_id;
        balance.balance = amount;
        return await this.repo.save(balance);
      }
    } catch (error) {
      throw error;
    }
  }
}
