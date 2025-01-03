import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { PaymentMethod, TopupStatus } from '../../../common/constants/app.constant';

@Entity({ name: 'topups' })
export class Topup extends BaseEntityAutoId {
  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  admin_id: string;

  @Column({ nullable: false })
  payment_method: PaymentMethod;

  @Column({ nullable: false })
  payment_code: string;

  @Column({ nullable: false })
  sender: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  status: TopupStatus;
}
