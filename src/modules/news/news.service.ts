import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { NewsRepository } from './news.repository';
import { CreateNewsDto } from './dto/create-news.req';
import { GetNewsRequestDto } from './dto/get-news.dto';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    private newsRepo: NewsRepository,
  ) {
    this.logger.log('============== Constructor Balance Service ==============');
  }

  async createNews(body: CreateNewsDto): Promise<ResponseDto<any>> {
    try {
      const news = await this.newsRepo.createNews(body);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, news);
    } catch (error) {
      this.logger.error(error);
      return ResponseDto.responseError(NewsService.name, error);
    }
  }

  async deleteNews(body: { id: number }): Promise<ResponseDto<any>> {
    try {
      const news = await this.newsRepo.repo.findOne({ where: { id: body.id } });
      if (!news) {
        return ResponseDto.responseError(NewsService.name, ErrorMap.NOT_FOUND);
      }

      await this.newsRepo.repo.softDelete({ id: body.id });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      this.logger.error(error);
      return ResponseDto.responseError(NewsService.name, error);
    }
  }

  async getNews(req: GetNewsRequestDto): Promise<ResponseDto<any>> {
    try {
      const { page, limit } = req;
      const news = await this.newsRepo.getNews(page, limit);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, news);
    } catch (error) {
      this.logger.error(error);
      return ResponseDto.responseError(NewsService.name, error);
    }
  }

  async getNewsByCategory(categoryId: number): Promise<ResponseDto<any>> {
    try {
      const news = await this.newsRepo.repo.findOne({ where: { categoryId } });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, news);
    } catch (error) {
      this.logger.error(error);
      return ResponseDto.responseError(NewsService.name, error);
    }
  }
}
