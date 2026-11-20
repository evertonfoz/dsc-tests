export class ProductPersistenceFailedException extends Error {
  constructor(cause?: unknown) {
    super('Product registration could not be completed.', { cause });
    this.name = 'ProductPersistenceFailedException';
  }
}
