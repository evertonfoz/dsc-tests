# Auditoria arquitetural do UC13 (Fase F)

Base: `main` em 7ea867d (merge do PR #118). Comandos e saídas em `docs/uc/uc13/evidencias/F/auditoria-comandos.txt`.

| # | Verificação | Resultado | Classificação |
|---|---|---|---|
| 1 | Entidade `Product` sem imports externos | Nenhum import | Evidência |
| 2 | Service sem TypeORM, sem DTO HTTP | Imports só de Nest (`Inject`, `Injectable`), exceções e entidades | Evidência |
| 3 | Controller sem TypeORM | Nenhuma referência | Evidência |
| 4 | Contrato do Repository sem tipos ORM | Nenhuma referência | Evidência |
| 5 | TypeORM só em `infrastructure` e `database` | Nenhum import fora deles (specs excluídos) | Evidência |
| 6 | Dois mappers separados (resposta HTTP × persistência) | `product-response.mapper.ts` e `product.mapper.ts` | Evidência |
| 7 | `deletedAt` não chega à resposta HTTP | Ausente do mapper de resposta e do controller | Evidência |
| 8 | DTO de query dependia do serviço (`MAX_PAGE_LIMIT` importado de `products.service.ts`) | Fronteira HTTP importando o núcleo para obter uma constante | **Problema (menor)** |

## Tratamento do achado 8
Refatoração com evidência: as constantes foram movidas para `src/modules/products/entities/product-pagination.rules.ts`, no mesmo padrão de `src/modules/products/entities/product-name.rules.ts` (ADR-004). Sem mudança de comportamento. Regressão em `docs/uc/uc13/evidencias/F/refatoracao-regressao.txt`: `pnpm test` com 47 passando e as 4 falhas conhecidas de `orders`; integração com 8 passando; build passou.

## Observações sem ação
- O adaptador em memória usa `Intl.Collator('pt-BR')`; o PostgreSQL usa `COLLATE "pt-BR-x-icu"`. Não há garantia de igualdade em todos os casos de borda; um teste de paridade (mesmos nomes variados nos dois adaptadores) reduziria o risco. **Proposta**, não implementada.
- `ProductPersistenceFailedException` agora serve a cadastro e listagem (mensagem passada por parâmetro). Nome mantido para preservar o contrato do UC12.
