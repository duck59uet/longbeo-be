import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';

@Entity({ name: 'balances' })
export class Balance extends BaseEntityAutoId {
  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  balance: number;
}
