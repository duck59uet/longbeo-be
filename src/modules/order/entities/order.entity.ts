import { Column, Entity } from 'typeorm';
import { BaseEntityIncreNumberId } from '../../../common/entities';
import { OrderStatus } from '../../../common/constants/app.constant';

@Entity({ name: 'orders' })
export class Order extends BaseEntityIncreNumberId {
  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @Column({ nullable: false })
  link: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true, type: 'float4', default: 0 })
  price: number;

  @Column({ nullable: true, type: 'float4', default: 0 })
  discount: number;

  @Column({ nullable: false })
  service_id: number;

  @Column({ nullable: false })
  service_time_id: number;

  @Column({ nullable: false })
  status: OrderStatus;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  actual_quantity: number;

  @Column({ nullable: true })
  source_order_id: string;
}
