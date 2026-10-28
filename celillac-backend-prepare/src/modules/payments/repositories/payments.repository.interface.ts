import { Payment } from '../entities/payment.entity.js';

export const PAYMENTS_REPOSITORY = 'PAYMENTS_REPOSITORY';

export interface PaymentsRepository {
  findByOrderId(orderId: string): Promise<Payment | null>;
  save(payment: Payment): Promise<Payment>;
  softDelete(paymentId: string): Promise<void>;
}