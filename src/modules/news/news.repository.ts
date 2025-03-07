import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.req';

@Injectable()
export class NewsRepository {
  private readonly logger = new Logger(NewsRepository.name);

  constructor(
    @InjectRepository(News)
    public repo: Repository<News>,
  ) {
    this.logger.log(
      '============== Constructor News Repository ==============',
    );
  }

  async createNews(createNewsDto: CreateNewsDto): Promise<News> {
    const news = new News();
    news.avatar = createNewsDto.avatar;
    news.title = createNewsDto.title;
    news.content = createNewsDto.content;
    news.status = true;

    return await this.repo.save(news);
  }

  async getNews(page: number, limit: number) {
    const sql = this.repo.createQueryBuilder('news').select([
      'news.id',
      'news.avatar',
      'news.title',
      'news.content',
      'news.status',
    ]);

    if (page && limit) {
      sql.offset((page - 1) * limit).limit(limit);
    }

    const [news, total] = await sql.getManyAndCount();
    return { news, total };
  }
}
