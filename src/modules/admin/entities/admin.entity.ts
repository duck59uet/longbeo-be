import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { Exclude } from 'class-transformer';
export enum AdminRole {
  SUPERADMIN = 'SuperAdmin',
  ADMIN = 'admin',
}
@Entity({ name: 'admins' })
export class Admin extends BaseEntityAutoId {
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  fullname: string;

  @Column({ type: 'enum', nullable: false, enum: AdminRole })
  role: AdminRole;

  @Column({ nullable: true})
  phone: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;
}
