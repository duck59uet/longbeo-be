import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';

@Entity({ name: 'balances' })
export class Balance extends BaseEntityAutoId {
  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @Column({ nullable: false, type: 'float' })
  balance: number;
}
