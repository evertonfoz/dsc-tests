export class InvalidProductNameException extends Error {
  constructor() {
    super('Product name must not be empty.');
    this.name = 'InvalidProductNameException';
  }
}
