import { Body, Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
} from '../../common/constants/api.constant';
import { TopupService } from './topup.service';
import {
  CommonAuthPost,
  Roles,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { CreateTopupDto } from './dto/request/topup.dto';
import { UserRole } from '../user/entities/user.entity';

@Controller(CONTROLLER_CONSTANTS.TOPUP)
@ApiTags(CONTROLLER_CONSTANTS.TOPUP)
export class TopupController {
  public readonly logger = new Logger(TopupController.name);

  constructor(private topupService: TopupService) {}
  @CommonAuthPost({
    url: 'create',
    summary: 'admin topup user',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'create order',
      schema: {},
    },
  })
  @Roles(UserRole.ADMIN)
  async createOrder(
    @Body() createOrderDto: CreateTopupDto,
  ): Promise<ResponseDto<any>> {
    return this.topupService.createTopup(createOrderDto);
  }
}
