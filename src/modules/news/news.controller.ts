import { Body, Controller, Logger, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { NewsService } from './news.service';
import { CommonAuthGet, CommonAuthPost } from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { CreateNewsDto } from './dto/create-news.req';
import { GetNewsRequestDto } from './dto/get-news.dto';

@Controller(CONTROLLER_CONSTANTS.NEWS)
@ApiTags(CONTROLLER_CONSTANTS.NEWS)
export class NewsController {
  public readonly logger = new Logger(NewsController.name);

  constructor(private newsService: NewsService) {}

  @CommonAuthPost({
    url: 'create',
    summary: 'create news',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'create news',
      schema: {},
    },
  })
  async createNews(@Body() body: CreateNewsDto): Promise<ResponseDto<any>> {
    return this.newsService.createNews(body);
  }

  @CommonAuthPost({
    url: 'delete',
    summary: 'delete news',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'delete news',
      schema: {},
    },
  })
  async deleteNews(@Body() body: { id: number }): Promise<ResponseDto<any>> {
    return this.newsService.deleteNews(body);
  }

  @CommonAuthGet({
    url: 'get',
    summary: 'get news',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'get news',
      schema: {},
    },
  })
  async getNews(@Query() req: GetNewsRequestDto): Promise<ResponseDto<any>> {
    return this.newsService.getNews(req);
  }
}
