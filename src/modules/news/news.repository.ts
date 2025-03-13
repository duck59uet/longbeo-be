import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.req';
import { UpdateNewsDto } from './dto/update-news.req';
import { Category } from '../category/entities/category.entity';

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

  async updateNews(updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.repo.findOne({ where: { id: updateNewsDto.id } });
    if (!news) {
      return null;
    }

    news.avatar = updateNewsDto.avatar;
    news.title = updateNewsDto.title;
    news.content = updateNewsDto.content;
    news.status = updateNewsDto.status;

    return await this.repo.save(news);
  }

  async getNews(page: number, limit: number) {
    // Tạo query builder chung
    const qb = this.repo
      .createQueryBuilder('news')
      .innerJoin(Category, 'c', 'c.id = news.categoryid')
      .select([
        'news.id as id',
        'news.avatar as avatar',
        'news.title as title',
        'news.content as content',
        'news.status as status',
        'c.name as category',
      ]);
  
    // Clone query builder cho đếm tổng số bản ghi
    const qbForCount = qb.clone();
  
    // Áp dụng phân trang cho query lấy dữ liệu
    if (page && limit) {
      qb.offset((page - 1) * limit).limit(limit);
    }
  
    // Thực hiện đồng thời query lấy dữ liệu và đếm tổng số bản ghi
    const [news, total] = await Promise.all([qb.execute(), qbForCount.getCount()]);
  
    return { news, total };
  }
}
