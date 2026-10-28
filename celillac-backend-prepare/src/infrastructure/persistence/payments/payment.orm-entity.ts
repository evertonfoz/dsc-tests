import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../../../common/enums/payment-status.enum.js';

@Entity({ name: 'payments', schema: 'payments' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  paymentId!: string;

  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'enum', enum: PaymentStatus })
  status!: PaymentStatus;

  // O driver pg devolve numeric como string; converte de volta para number.
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  amount!: number;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt!: Date | null;

  // Datas geradas pelo banco; a aplicação nunca as envia.
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date | null;
}
