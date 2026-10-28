import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../../../common/enums/order-status.enum.js';

@Entity({ name: 'orders', schema: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  // Datas geradas pelo banco; a aplicação nunca as envia.
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;
}
