import { PaymentStatus } from '../../../common/enums/payment-status.enum.js';

export class Payment {
  constructor(
    public paymentId: string,
    public orderId: string,
    public status: PaymentStatus,
    public amount: number,
    public paidAt: Date | null,
    // Datas geradas pelo banco; o domínio apenas as lê.
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null = null,
  ) {}
}
