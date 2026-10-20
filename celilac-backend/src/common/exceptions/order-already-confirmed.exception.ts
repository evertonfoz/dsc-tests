export class OrderAlreadyConfirmedException extends Error {
  constructor(orderId: string) {
    super(`Order "${orderId}" is already confirmed.`);
    this.name = 'OrderAlreadyConfirmedException';
  }
}
