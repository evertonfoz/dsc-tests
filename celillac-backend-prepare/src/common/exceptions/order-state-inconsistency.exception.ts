import { OrderStatus } from
  '../../common/enums/order-status.enum.js';
import { PaymentStatus } from
  '../../common/enums/payment-status.enum.js';

export class OrderStateInconsistencyException extends Error {
  constructor(
    orderStatus: OrderStatus,
    paymentStatus: PaymentStatus,
  ) {
    super(
      `Order state is inconsistent. ` +
      `Order: ${orderStatus}, Payment: ${paymentStatus}.`
    );
    this.name = 'OrderStateInconsistencyException';
  }
}