# Relatório da Fase C — UC16 Remover Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC16 — Remover Produto |
| Fase | C — HTTP (C1) e persistência (C2) |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | C1 #163, C2 #164, Epic #156 |
| Branch | `feature/uc16-remover-produto` (PR único, `pr_compartilhado`) |

## 1. O que foi feito
- **C1 (HTTP):** `DELETE /products/:productId` com `204`, reaproveitando `createProductIdPipe` e o `DomainHttpExceptionFilter`; sem DTO de entrada, o corpo é ignorado — Executado.
- **C2 (persistência):** `TypeOrmProductsRepository.removeActive` com **um único** `UPDATE ... SET "deletedAt" = now() WHERE "productId" = ... AND "deletedAt" IS NULL`. Sem migration (a coluna é do UC13) — Executado.
- A tabela `products.products` não tem chave estrangeira apontando para ela nesta base de testes; a conferência no banco de desenvolvimento não foi feita nesta fase — Aguardando evidência.

## 2. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | RED de C1: 7 testes falham (rota inexistente) | Executado | `../evidencias/C/c1-red.txt` |
| 2 | GREEN de C1: 7 testes passam | Executado | `../evidencias/C/c1-green.txt` |
| 3 | RED de C2 no banco de testes: 4 falham; o de falha real de banco passou por acaso | Executado | `../evidencias/C/c2-red.txt` |
| 4 | GREEN de C2 no banco de testes: 24 passam, inclusive remoções simultâneas | Executado | `../evidencias/C/c2-green.txt` |
| 5 | e2e com banco de testes: 4 testes novos passam; 1 falha de `orders` já existia sem o UC16 | Executado | `../evidencias/C/c2-e2e.txt` |
| 6 | build, lint e `pnpm test` (100 passam; 4 falham em `orders`, ADR-001) | Executado | `../evidencias/C/c2-build-lint-test.txt` |

## 3. Desvios do método (registrados)
- **RED parcial em C2:** o teste de falha real de banco (CA11) passou antes do GREEN, porque o método provisório já rejeitava e o serviço traduz a falha. Os outros 4 falharam pelo motivo certo.
- **e2e escrito depois do GREEN:** `test/products/remover-produto.e2e-spec.ts` é verificação, sem RED.
- **Falha de e2e preexistente** em `orders` (ver nota em `c2-e2e.txt`).

## 4. Tabela de cobertura
A tabela vigente está em `A.md` (seção 4) e é atualizada a cada fatia.

## 5. Gate de saída
Pendente: aprovação do estudante. Nenhum gate foi aprovado por mim.

## 6. Pendências e riscos
- Sem PR, sem merge e sem fechamento de issues. Os commits da C1 e da C2 ainda não foram enviados ao remoto.
- A conferência de dependências (chaves estrangeiras para `products`) no banco de desenvolvimento fica para a Fase F.
