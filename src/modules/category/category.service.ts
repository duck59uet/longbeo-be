import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CommonUtil } from '../../utils/common.util';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(private categoryRepo: CategoryRepository) {
    this.logger.log('============== Constructor Category Service ==============');
  }
}
