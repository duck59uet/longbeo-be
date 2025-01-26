import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { CategoryService } from './category.service';

@Controller(CONTROLLER_CONSTANTS.CATEGORY)
@ApiTags(CONTROLLER_CONSTANTS.CATEGORY)
export class CategoryController {
  public readonly logger = new Logger(CategoryController.name);

  constructor(private categoryService: CategoryService) {}
}
