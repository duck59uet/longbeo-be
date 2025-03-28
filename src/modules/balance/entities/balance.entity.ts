import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';

@Entity({ name: 'balances' })
export class Balance extends BaseEntityAutoId {
  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @Column({ nullable: true, type: 'float4', default: 0 })
  balance: number;
}
