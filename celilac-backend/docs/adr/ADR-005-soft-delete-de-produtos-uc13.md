# ADR-005 — Soft delete de produtos (`deletedAt`) para a listagem do UC13

- **Status:** Aceita
- **Data:** 2026-11-23
- **Decisores:** Estudante responsável (respostas da Etapa 1 do UC13)
- **Caso de uso / fase:** UC13 — Listar Produtos, fatia F02 (#107)

## Contexto
A listagem deve trazer apenas produtos ativos (RN01, RN06). A entidade `Product` só tem `productId` e `name`, e não existe operação de remover produto. A regra do projeto exige decisão própria para novo atributo.

## Decisão
1. `Product` ganha `deletedAt: Date | null`; `null` significa **ativo**. Novos produtos nascem ativos.
2. O atributo é **interno**: não aparece na resposta HTTP (a resposta continua `productId` e `name`).
3. O contrato do Repository ganha `findActivePage`, que só considera produtos com `deletedAt` nulo. `save` e o contrato do `POST /products` não mudam.
4. A coluna e a migration (reversível, produtos existentes permanecem ativos) entram na Fase C2 (#114).
5. A operação de remover produto continua **fora do escopo**; seria outro caso de uso.

## Consequências
- (+) Listagem e total ignoram removidos de forma consistente.
- (+) Alteração aditiva; nomes e assinaturas existentes preservados.
- (−) Até existir o UC de remoção, só testes criam produtos removidos (direto no repositório ou no banco de testes).

## Alternativas consideradas
- **Booleano `active`** — descartada pelo estudante: perde o momento da remoção.
