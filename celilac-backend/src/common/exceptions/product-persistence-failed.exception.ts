export class ProductPersistenceFailedException extends Error {
  constructor(
    cause?: unknown,
    message = 'Product registration could not be completed.',
  ) {
    super(message, { cause });
    this.name = 'ProductPersistenceFailedException';
  }
}
