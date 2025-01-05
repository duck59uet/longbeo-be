import { Column, Entity } from 'typeorm';
import { BaseEntityIncreNumberId } from '../../../common/entities';
import { ServiceStatus } from '../../../common/constants/app.constant';

@Entity({ name: 'services' })
export class Service extends BaseEntityIncreNumberId {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'float' })
  price: number;

  @Column({ nullable: false })
  categoryId: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  status: ServiceStatus;
}
