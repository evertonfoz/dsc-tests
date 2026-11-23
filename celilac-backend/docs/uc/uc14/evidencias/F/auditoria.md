# Auditoria arquitetural do UC14 (Material 12)

Saída bruta em `auditoria.txt`. Executado em 2026-11-23, somente leitura.

| Verificação | Resultado |
|---|---|
| Entidade `Product` sem imports externos | Conforme: nenhum import |
| `ProductsService` sem TypeORM, DTO HTTP ou `express` | Conforme |
| `ProductsController` sem TypeORM | Conforme |
| Contrato `ProductsRepository` sem tipos do TypeORM | Conforme; a única mudança é `findActiveById` (aditiva) |
| Dois mappers separados (resposta × persistência) | Conforme: `product-response.mapper.ts` reaproveitado; `product.mapper.ts` intacto |
| Nomes e assinaturas preservados (`productId`, `save`, `findActivePage`) | Conforme: entidade, DTOs, ORM entity e mapper de persistência sem alteração desde `992cd44` |
| Sem novo atributo na entidade ou na resposta | Conforme |

**Observação:** o pipe de UUID (`src/common/pipes/product-id.pipe.ts`) depende de `@nestjs/common`. Isso é fronteira HTTP, fora do núcleo; o Service não o conhece. Nenhum achado a corrigir.

**Observação:** os 17 avisos `unbound-method` do lint e as 4 falhas de `orders` (ADR-001) são anteriores ao UC14.
