import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../../common/constants/app.constant';

@Entity({ name: 'users' })
export class User extends BaseEntityAutoId {
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  fullname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', nullable: false, enum: UserRole })
  role: UserRole;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true})
  phone: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  jwtToken: string;

  @Column({ nullable: true, default: 1 })
  level: number;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  referUser: string;

  @Exclude()
  @Column({ nullable: true })
  apiKey: string;
}
