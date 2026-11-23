import { ParseUUIDPipe } from '@nestjs/common';
import { InvalidProductIdException } from '../exceptions/invalid-product-id.exception.js';

// Valida o parâmetro de rota `productId` (UUID de qualquer versão) com exceção específica (UC14, FA03).
export function createProductIdPipe(): ParseUUIDPipe {
  return new ParseUUIDPipe({
    exceptionFactory: () => new InvalidProductIdException(),
  });
}
