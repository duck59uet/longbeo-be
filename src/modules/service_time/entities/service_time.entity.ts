import { Column, Entity } from 'typeorm';
import { BaseEntityIncreNumberId } from '../../../common/entities';

@Entity({ name: 'service_times' })
export class ServiceTime extends BaseEntityIncreNumberId {
  @Column({ nullable: false })
  serviceId: number;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  sourceServiceId: string;
}
