import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { OrderStatus } from '../../../common/constants/app.constant';

@Entity({ name: 'orders' })
export class Order extends BaseEntityAutoId {
  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @Column({ nullable: false })
  link: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  service_id: number;

  @Column({ nullable: false })
  status: OrderStatus;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  actual_quantity: number;
}
