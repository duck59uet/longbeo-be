import { Body, Controller, Logger, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { NewsService } from './news.service';
import {
  Common,
  CommonAuthGet,
  CommonAuthPost,
  CommonGet,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { CreateNewsDto } from './dto/create-news.req';
import { GetNewsRequestDto } from './dto/get-news.dto';
import { UpdateNewsDto } from './dto/update-news.req';

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
    url: 'update',
    summary: 'update news',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'update news',
      schema: {},
    },
  })
  async updateNews(@Body() body: UpdateNewsDto): Promise<ResponseDto<any>> {
    return this.newsService.updateNews(body);
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

  @CommonGet({
    url: 'user/get/:categoryId',
    summary: 'get all news',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'get all news',
      schema: {},
    },
  })
  async getNewsByCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseDto<any>> {
    return this.newsService.getNewsByCategory(categoryId);
  }

  @CommonGet({
    url: 'user/admin/:id',
    summary: 'get all news',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'get all news',
      schema: {},
    },
  })
  async getNewsById(@Param('id') id: number): Promise<ResponseDto<any>> {
    return this.newsService.getNewsById(id);
  }
}
