import { Column, Entity } from 'typeorm';
import { BaseEntityIncreNumberId } from '../../../common/entities';

@Entity({ name: 'userLevels' })
export class UserLevel extends BaseEntityIncreNumberId {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: 0 })
  discount: number;
}
