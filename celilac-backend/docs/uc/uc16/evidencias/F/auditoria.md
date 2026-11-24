# Auditoria arquitetural do UC16

Saída bruta em `auditoria.txt`. Executada em 2026-11-24, somente leitura. Nenhum código foi alterado por esta auditoria.

| Verificação | Resultado |
|---|---|
| Entidade `Product` sem imports externos | Conforme: nenhum import |
| `ProductsService` sem TypeORM, DTO HTTP ou `express` | Conforme |
| `ProductsController` sem TypeORM | Conforme |
| Contrato `ProductsRepository` sem tipos do TypeORM | Conforme; a única mudança é `removeActive` (aditiva) |
| Entidade, mappers, ORM entity, DTOs e `src/database` intactos | Conforme: `git diff main` vazio; sem migration |
| Specs e e2e antigos sem alteração além de acréscimos | Conforme: o único arquivo antigo alterado (`typeorm-products.repository.postgres.spec.ts`) tem 110 linhas acrescentadas e 0 removidas |
| Marca provisória removida | Conforme: nenhuma ocorrência de "ainda não implementado" em `src` |
| Remoção sem efeito parcial | Conforme: `UPDATE` único com `deletedAt IS NULL`; provado no PostgreSQL de testes (CA07, CA08, CA11, CA12) |
| Dependências de outras entidades | Conforme: 0 chaves estrangeiras para `products.products` no banco de desenvolvimento (`dependencias-fk.txt`) e nenhum `ManyToOne`, `OneToMany` ou `JoinColumn` em `src` |

**Observação:** o `deletedAt` vem de fontes diferentes: `now()` do banco no TypeORM e `new Date()` no repositório em memória. Nenhum teste compara os dois valores; só se exige que esteja preenchido. Não foi refatorado por falta de evidência de custo.

**Observação:** os avisos `unbound-method` do lint e as falhas de `orders` (4 em `pnpm test`, 1 em `pnpm test:e2e`, ADR-001) são anteriores ao UC16.

Nenhum achado a corrigir.
