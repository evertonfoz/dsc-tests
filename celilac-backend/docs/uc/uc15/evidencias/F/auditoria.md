# Auditoria arquitetural do UC15 (Material 12)

Saída bruta em `auditoria.txt`. Executada em 2026-11-24, somente leitura. Nenhum código foi alterado por esta auditoria.

| Verificação | Resultado |
|---|---|
| Entidade `Product` sem imports externos | Conforme: nenhum import |
| `ProductsService` sem TypeORM, DTO HTTP ou `express` | Conforme |
| `ProductsController` sem TypeORM | Conforme |
| Contrato `ProductsRepository` sem tipos do TypeORM | Conforme; a única mudança é `updateActiveName` (aditiva) |
| Dois mappers separados (resposta × persistência) | Conforme: `toProductResponse` reaproveitado; `product.mapper.ts` intacto |
| Nomes e assinaturas preservados (`productId`, `save`, `findActivePage`, `findActiveById`) | Conforme: `git diff origin/main` de entidade, mappers, ORM entity, `CreateProductDto` e `src/database` está vazio |
| Sem novo atributo na entidade, no ORM ou na resposta | Conforme |
| Specs dos UC12 a UC14 sem alteração | Conforme: `git diff origin/main` vazio para os 7 arquivos de teste antigos conferidos |
| Regra do nome reaproveitada, sem duplicar | Conforme: `assertValidName` no Service é usado por `createProduct` e `updateProductName`; `UpdateProductDto` usa `MAX_PRODUCT_NAME_LENGTH` |
| Alteração sem efeito parcial | Conforme: `UPDATE` único com `deletedAt IS NULL`; provado no PostgreSQL de testes (CA06, CA10) |

**Observação:** o `UpdateProductDto` repete os decoradores do `CreateProductDto` (`@IsString`, `@Matches`, `@MaxLength`). A constante do limite é compartilhada, mas os decoradores não. É duplicação pequena e intencional (dois contratos HTTP podem divergir no futuro); não foi refatorada por falta de evidência de custo.

**Observação:** os avisos `unbound-method` do lint e as falhas de `orders` (4 em `pnpm test`, 1 em `pnpm test:e2e`, ADR-001) são anteriores ao UC15.

Nenhum achado a corrigir.
