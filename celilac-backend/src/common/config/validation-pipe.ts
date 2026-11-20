import { ValidationPipe } from '@nestjs/common';

// Configuração única do ValidationPipe: usada por main.ts e pelos testes que sobem a aplicação (achado A2 da Fase F do UC12).
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({ whitelist: true, transform: true });
}
