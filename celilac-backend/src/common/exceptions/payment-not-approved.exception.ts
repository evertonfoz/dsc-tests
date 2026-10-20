import { PaymentStatus } from
  '../../common/enums/payment-status.enum.js';

export class PaymentNotApprovedException extends Error {
  constructor(status: PaymentStatus) {
    super(
      `Payment is not approved. Current status: ${status}.`
    );
    this.name = 'PaymentNotApprovedException';
  }
}
