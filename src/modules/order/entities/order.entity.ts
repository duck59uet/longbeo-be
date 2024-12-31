import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { OrderStatus } from '../../../common/constants/app.constant';

@Entity({ name: 'orders' })
export class Order extends BaseEntityAutoId {
  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  service_id: string;

  @Column({ nullable: false })
  status: OrderStatus;
}
