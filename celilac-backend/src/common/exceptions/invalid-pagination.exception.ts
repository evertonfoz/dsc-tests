export class InvalidPaginationException extends Error {
  constructor() {
    super(
      'page must be an integer >= 1 and limit an integer between 1 and 100.',
    );
    this.name = 'InvalidPaginationException';
  }
}
