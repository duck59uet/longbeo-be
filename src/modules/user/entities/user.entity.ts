import { Column, Entity } from 'typeorm';
import { BaseEntityAutoId } from '../../../common/entities';
import { Exclude } from 'class-transformer';
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity({ name: 'users' })
export class User extends BaseEntityAutoId {
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', nullable: false, enum: UserRole })
  role: UserRole;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  jwtToken: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  password: string;
}
