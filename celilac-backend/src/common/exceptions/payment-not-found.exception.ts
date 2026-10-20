export class PaymentNotFoundException extends Error {
  constructor(orderId: string) {
    super(`Payment for order "${orderId}" was not found.`);
    this.name = 'PaymentNotFoundException';
  }
}
