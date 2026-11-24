# 01 — O UC16 (Remover Produto) existe?

> Busca real feita em 2026-11-24, na branch `main`. Origem: **Executado** (comandos listados) e **Confirmado no código**.

## Resultado da busca (3.1)

| O que procurei | Onde | O que encontrei |
|---|---|---|
| Especificação de "remover/excluir/apagar produto", `DELETE /products`, `UC16` (`grep -rIil`) | `prompts/`, `docs/`, `method/` | Só os próprios prompts do UC16 (`uc-remover.md`, `uc-remover-estado-como-fonte.md`, `00-uc-referencia.md`), a ADR-005 e o UC13, que dizem que **a remoção está fora do escopo** deles. Nenhuma especificação do UC16 |
| `@Delete(`, `remove…(`, `delete…(`, `softDelete` | `src/modules/products`, `src/infrastructure`, `test` (sem `orders` e `payments`) | **Nenhuma ocorrência.** O `softDelete` que existe é de pedidos e pagamentos, por outro mecanismo (`@DeleteDateColumn`) |
| Issues no GitHub (`gh issue list --state all --search …`) | repositório remoto | `"UC16"`: nenhuma. `"remover produto"` e `"excluir produto"`: apenas a #107 (`[UC13][F02] Excluir produtos removidos (soft delete) da lista e do total`, **fechada**), casamento por texto, sem relação com o UC16 |
| Estado dos UCs | `docs/uc/` | `uc12`, `uc13`, `uc14`, `uc15`. Não existe `uc16` |
| Produtos removidos no código de produção | `src/` | **Nenhum caminho cria produto removido.** Só testes o fazem (ex.: `products.service.list.spec.ts` e o spec do PostgreSQL), diretamente pelo repositório ou pelo banco de testes |

## Leitura das implementações do Repository (cada uma separada)

| Implementação | O que faz com o produto removido | Observação |
|---|---|---|
| `InMemoryProductsRepository` | `findActivePage`, `findActiveById` e `updateActiveName` filtram por `deletedAt === null`. `save` apenas **acrescenta** | `save` não serve para remover (acrescentaria um segundo item) |
| `TypeOrmProductsRepository` | `findActivePage` e `findActiveById` filtram `deletedAt IS NULL`. `updateActiveName` é um `UPDATE … WHERE "deletedAt" IS NULL … RETURNING`. `save` grava o que recebe | Padrão a seguir: **uma única instrução** condicionada ao produto ativo |

## Observações

- **Observação:** `Product.deletedAt` (ADR-005, UC13) é a **base** da remoção, mas **não é** o caso de uso. Até hoje a ADR-005 diz que "a operação de remover produto continua fora do escopo".
- **Observação:** não há referência a produto em `orders`, `payments` nem nas migrations deles (busca textual). Parece não haver chave estrangeira apontando para `products`. É busca, não prova: a Etapa 2 confirma no banco.
- **Observação:** a coluna `deletedAt` já existe no banco (migration `AddDeletedAtToProducts`). A remoção lógica **não exige migration**.

## Decisão

**Decisão A — Não existe.** Segue para 3.2 (criar o UC a partir do `REF`).
