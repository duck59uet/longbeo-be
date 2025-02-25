import { Body, Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CONTROLLER_CONSTANTS,
} from '../../common/constants/api.constant';
import {
  CommonPost,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { ApiService } from './api.service';
import { ApiDto } from './dto/api.req';

@Controller(CONTROLLER_CONSTANTS.V2)
@ApiTags(CONTROLLER_CONSTANTS.V2)
export class ApiController {
  public readonly logger = new Logger(ApiController.name);

  constructor(private apiService: ApiService) {}

  @CommonPost({
    url: '',
    summary: 'API v2',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'API v2',
      schema: {},
    },
  })
  async getUserInfo(@Body() body: ApiDto) {
    this.logger.log('========== API v2 ==========');
    return this.apiService.apiForSale(body);
  }
}
