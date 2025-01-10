import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseEntityIncreNumberId extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
