import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(
    @InjectRepository(Category)
    public repo: Repository<Category>,
  ) {
    this.logger.log(
      '============== Constructor Category Repository ==============',
    );
  }
}
