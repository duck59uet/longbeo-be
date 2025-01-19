import { Body, Controller, Logger, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { TopupService } from './topup.service';
import { CommonAuthGet, CommonAuthPost, Roles } from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { CreateTopupDto } from './dto/request/topup.dto';
import { GetTopupRequestDto } from './dto/request/get-topup.req';
import { UserRole } from '../../common/constants/app.constant';

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

  @CommonAuthGet({
    url: 'user/history',
    summary: 'user get topup history',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'user get topup history',
      schema: {},
    },
  })
  @Roles(UserRole.USER)
  async getUserTopupHistory(@Query() query: GetTopupRequestDto): Promise<ResponseDto<any>> {
    return this.topupService.getUserTopupHistory(query);
  }

  @CommonAuthGet({
    url: 'admin/history',
    summary: 'user get topup history',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'user get topup history',
      schema: {},
    },
  })
  // @Roles(UserRole.USER)
  async getAdminTopupHistory(@Query() query: GetTopupRequestDto): Promise<ResponseDto<any>> {
    return this.topupService.getAdminTopupHistory(query);
  }
}
