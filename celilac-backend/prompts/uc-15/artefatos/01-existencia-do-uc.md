# 01 — O UC15 (Alterar Produto) existe?

> Busca real feita em 2026-11-24, na branch `main`. Origem: **Executado** (comandos listados) e **Confirmado no código**.

## Resultado da busca (3.1)

| O que procurei | Onde | O que encontrei |
|---|---|---|
| Especificação de "alterar/atualizar/editar produto", `PUT/PATCH /products`, `UC15` | `prompts/`, `docs/`, `method/` (`grep -rIil`) | Apenas os próprios prompts `uc-alterar.md` e `uc-alterar-cobertura-real.md`. Nenhuma especificação |
| `@Put(`, `@Patch(`, `update…(`, `alterar…(` | `src/modules/products`, `src/infrastructure/persistence/products` | Nenhuma ocorrência |
| Issues no GitHub (`gh issue list --state all --search "alterar produto"` e `"UC15"`) | repositório remoto | Nenhuma Issue do UC15. A única linha devolvida foi a #127, do UC14 (casamento por texto, sem relação) |
| Estado dos UCs | `docs/uc/` | `uc12`, `uc13`, `uc14`. Não existe `uc15` |
| Operação de gravação no Repository | `products.repository.interface.ts` e as duas implementações | `save`, `findActivePage` e `findActiveById`. Nenhuma operação de atualização |

## Leitura das implementações do Repository (cada uma separada)

| Implementação | `save` com `productId` já existente | Consequência |
|---|---|---|
| `TypeOrmProductsRepository` (banco) | `ormRepository.save` com chave primária existente **atualiza** a linha | Serviria, mas também atualizaria produto removido e não informa se o item existia |
| `InMemoryProductsRepository` | `this.products.push(product)` **acrescenta** | **Problema:** reaproveitar o `save` duplicaria o produto em memória |

## Decisão

**Decisão A — o UC não existe.** Segue para a criação da especificação (3.2), moldada no `REF`.

## Classificação dos achados

- **Observação:** os atributos de `Product` são `readonly`; alterar o nome exige nova instância com o mesmo `productId` e o mesmo `deletedAt`.
- **Problema:** o `save` em memória não serve para atualizar (duplica). Decisão do estudante: criar operação própria de atualização no Repository, sem alterar o contrato do `save`.
- **Observação:** a regra do nome (não vazio, só espaços, até 120 caracteres) existe no `CreateProductDto` e no `createProduct` do Service; deve ser reaproveitada (regra 12 do prompt).
- **Observação:** a ADR-004 (item 4) já define que campos desconhecidos no corpo são ignorados (`whitelist`).
