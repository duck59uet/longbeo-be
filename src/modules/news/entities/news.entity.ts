import { Column, Entity } from 'typeorm';
import { BaseEntityIncreNumberId } from '../../../common/entities';

@Entity({ name: 'news' })
export class News extends BaseEntityIncreNumberId {
  @Column({ nullable: false })
  avatar: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, type: 'jsonb' })
  content: Object;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true })
  categoryId: number;
}
