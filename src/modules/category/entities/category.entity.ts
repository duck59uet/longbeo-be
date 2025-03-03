import { Column, Entity } from 'typeorm';
import { BaseEntityIncreNumberId } from '../../../common/entities';

@Entity({ name: 'categories' })
export class Category extends BaseEntityIncreNumberId {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  enName: string;
}
