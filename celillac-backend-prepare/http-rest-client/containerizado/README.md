# Testes HTTP do ambiente containerizado

Verificam o backend NestJS rodando em contêiner (`celilac-api`), conversando com o PostgreSQL em contêiner (`celilac-postgres`). Os arquivos `.http` já usam `localhost:3200`, a porta publicada pelo Compose, então funcionam igual para a API local ou containerizada. Esta pasta existe para reunir, em um lugar só, os testes que **assumem** o ambiente Docker.

## Pré-requisitos

```bash
docker compose up -d --build api
docker compose ps        # celilac-postgres (healthy) e celilac-api (Up)
```

## Conteúdo

| Arquivo | Uso |
|---|---|
| `00-smoke.http` | API respondendo na porta publicada (200) e rota inexistente (404). |
| `01-products-uc12.http` | UC12: cadastro válido (201), validações (400) e whitelist. Guarda o `productId` em variável. |
| `02-orders-fronteira.http` | Pedidos sem dados semeados: UUID malformado (400) e pedido inexistente (404). |
| `run-checks.sh` | Mesma verificação, automatizada, com asserções, mais consulta SQL e durabilidade. |

Os `.http` exigem a extensão **REST Client** do VS Code e **não fazem asserção**: você compara o status com o esperado, escrito no título de cada requisição.

## Verificação automatizada

```bash
./http-rest-client/containerizado/run-checks.sh                # sem reiniciar nada
./http-rest-client/containerizado/run-checks.sh --durability   # reinicia SOMENTE a API
```

O script confere: serviços (`api` Up, `postgres` healthy), smoke, ausência de migrations pendentes (somente leitura), cenários do `POST /products`, fronteira de pedidos, o registro em `products.products` e, com `--durability`, o mesmo registro depois de `docker compose restart api`. Termina com código 0 se tudo passar, diferente de 0 se algo falhar. Use `BASE_URL=...` para outra porta.

O que ele grava: dois produtos por execução em `products.products` (`celilac_db`), ambos por `POST /products`. Não remove volumes, não usa `down -v` e não altera migrations.

## Consulta SQL manual

Use o `productId` devolvido pelo cenário 1 de `01-products-uc12.http`:

```bash
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM products.products WHERE "productId" = '<PRODUCT_ID>';
SQL
```

Rode antes e depois de `docker compose restart api`: o registro deve ser idêntico.

## Fora desta pasta

- Cenários de pedido com dados existentes (200, 409, 422) dependem de `pnpm seed:scenarios` e estão em `../orders/test-scenarios.http`.
- Testes com Vitest (`pnpm test`, `pnpm test:integration`) são outro nível de evidência; veja `prompts/10/10-guia-verificacao-pos-atividade.md`.
- Não rode `pnpm test:e2e` contra o `celilac_db`.
