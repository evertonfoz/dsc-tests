import { describe, expect, it } from 'vitest';
import { InvalidProductIdException } from '../exceptions/invalid-product-id.exception.js';
import { createProductIdPipe } from './product-id.pipe.js';

const metadata = { type: 'param' as const, data: 'productId' };

describe('createProductIdPipe (UC14)', () => {
  it('should reject a non-UUID product id with InvalidProductIdException (CA05)', async () => {
    const pipe = createProductIdPipe();

    const result = pipe.transform('abc', metadata);

    await expect(result).rejects.toBeInstanceOf(InvalidProductIdException);
  });

  it('should accept a valid UUID unchanged', async () => {
    const pipe = createProductIdPipe();
    const id = '11111111-1111-4111-8111-111111111111';

    await expect(pipe.transform(id, metadata)).resolves.toBe(id);
  });
});
