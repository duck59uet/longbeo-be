import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../../common/constants/app.constant';

@Entity({ name: 'admins' })
export class Admin extends BaseEntityAutoId {
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  fullname: string;

  @Column({ type: 'enum', nullable: false, enum: UserRole })
  role: UserRole;

  @Column({ nullable: true})
  phone: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;
}
