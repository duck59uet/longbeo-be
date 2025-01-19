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
  sourceServiceId: string;

  @Column({ nullable: true })
  sourceAddress: string;

  @Column({ nullable: true })
  status: ServiceStatus;

  @Column({ nullable: true, type: 'float', default: 100 })
  rate: number;

  @Column({ nullable: true })
  apiKey: string;
}
