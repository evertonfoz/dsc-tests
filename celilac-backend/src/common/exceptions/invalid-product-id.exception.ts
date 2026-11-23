export class InvalidProductIdException extends Error {
  constructor() {
    super('productId must be a valid UUID.');
    this.name = 'InvalidProductIdException';
  }
}
