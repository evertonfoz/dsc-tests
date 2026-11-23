export class ProductLookupFailedException extends Error {
  constructor(cause?: unknown) {
    super('Product lookup could not be completed.', { cause });
    this.name = 'ProductLookupFailedException';
  }
}
