import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { TopupStatus } from '../../../common/constants/app.constant';

@Entity({ name: 'topups' })
export class Topup extends BaseEntityAutoId {
  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false, type: 'uuid' })
  admin_id: string;

  @Column({ nullable: false })
  sender: string;

  @Column({ nullable: true })
  status: TopupStatus;
}
