# ARTEFATO 10-07 — OPERAÇÃO HTTP, PERSISTÊNCIA, DURABILIDADE E REEXECUÇÃO DE TESTES

## 1. Contexto e Objetivos

O objetivo desta fase é demonstrar a arquitetura completa do sistema em contêineres:
$$\text{Cliente HTTP} \longrightarrow \text{API NestJS em Contêiner} \longrightarrow \text{PostgreSQL em Contêiner} \longrightarrow \text{Volume Persistente}$$

Comprovando:
1. Recepção e validação de requisição real `POST /products` na porta publicada `3200`.
2. Persistência física do registro na tabela `products.products` do schema `products`.
3. Sobrevivência e durabilidade dos dados após a reinicialização isolada do contêiner da API (`docker compose restart api`).
4. Reexecução dos testes automatizados comprovando a ausência de regressões no caso de uso `UC12`.

---

## 2. Operação HTTP Real — Cadastro de Produto (`POST /products`)

### 2.1 Requisição Válida (Caminho Feliz)

Foi emitida requisição HTTP `POST` a partir do host para o endpoint da API containerizada:

```bash
curl -i -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto de exemplo"}'
```

#### Resposta HTTP Recebida:

```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 80
ETag: W/"50-CfH9/Jg09YuDww96jCbCY1+1iX8"
Date: Fri, 20 Nov 2026 12:51:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"1c531e27-449a-40e0-8104-09daa975e9ea","name":"Produto de exemplo"}
```

- **Status HTTP:** `201 Created`
- **Identificador Gerado:** `productId: "1c531e27-449a-40e0-8104-09daa975e9ea"`
- **Nome Persistido:** `"Produto de exemplo"`

### 2.2 Teste de Validação e Descarte de Atributos Extras

Também foram verificados cenários de proteção na fronteira HTTP:

1. **Nome Vazio (`POST /products` com `{"name":""}`):**
   ```http
   HTTP/1.1 400 Bad Request
   {"message":["name should not be empty"],"error":"Bad Request","statusCode":400}
   ```
2. **Atributo Extra (`POST /products` com `{"name":"Pao Sem Gluten","extraField":"ignorar"}`):**
   ```http
   HTTP/1.1 201 Created
   {"productId":"87f4f314-3441-40f6-8b31-22399cd8ee74","name":"Pao Sem Gluten"}
   ```
   *O atributo `extraField` foi sumariamente descartado pelo `ValidationPipe({ whitelist: true })` antes de atingir o serviço de domínio.*

---

## 3. Consulta SQL Inicial no Banco de Dados (`celilac_db`)

Com o registro cadastrado via HTTP, foi realizada consulta SQL direta dentro do contêiner `celilac-postgres`:

```bash
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM products.products WHERE "productId" = '1c531e27-449a-40e0-8104-09daa975e9ea';
SQL
```

### Resultado SQL Obtido:

```text
              productId               |        name        
--------------------------------------+--------------------
 1c531e27-449a-40e0-8104-09daa975e9ea | Produto de exemplo
(1 row)
```

O registro foi gravado com sucesso no schema `products` e tabela `products`.

---

## 4. Reinicialização Isolada da API e Comprovação de Durabilidade

Para comprovar que os dados estão efetivamente persistidos no volume Docker e não em memória temporária do processo da API, foi reiniciado **exclusivamente o contêiner da API**:

```bash
docker compose restart api
```

O contêiner `celilac-postgres` e seus volumes **não foram reiniciados nem removidos**. Após o reinício do contêiner da API, a consulta SQL foi imediatamente reexecutada:

```bash
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM products.products WHERE "productId" = '1c531e27-449a-40e0-8104-09daa975e9ea';
SQL
```

### Resultado SQL Obtido Após o Reinício:

```text
              productId               |        name        
--------------------------------------+--------------------
 1c531e27-449a-40e0-8104-09daa975e9ea | Produto de exemplo
(1 row)
```

### Conclusão de Durabilidade:
O exato mesmo registro (`1c531e27-449a-40e0-8104-09daa975e9ea` / `Produto de exemplo`) permaneceu intacto e acessível. A persistência em volume físico (`celilac_postgres_data`) e a resiliência do backend containerizado foram cabalmente comprovadas.

---

## 5. Reexecução dos Testes Automatizados e Análise de Regressões

### 5.1 Teste de Integração Real com PostgreSQL (`pnpm test:integration`)
Executado contra o banco isolado `celilac-postgres-test` na porta `5435`:

```bash
$ vitest run --config ./vitest.integration.config.ts

 ✓ src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts (1 test) 61ms
   ✓ TypeOrmProductsRepository — persistência real no PostgreSQL (1)
     ✓ deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco 19ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  441ms
```

### 5.2 Testes Unitários e Integrados em Memória do UC12
Executados para verificar todos os componentes do domínio `products`:

```bash
$ vitest run src/modules/products/ src/app.controller.spec.ts

 ✓ src/app.controller.spec.ts (1 test) 84ms
 ✓ src/modules/products/services/products.service.spec.ts (1 test) 82ms
 ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 62ms
 ✓ src/modules/products/products.integration.spec.ts (2 tests) 56ms

 Test Files  4 passed (4)
      Tests  6 passed (6)
   Duration  483ms
```

### Resumo Consolidado dos Testes:
- **Total de testes do UC12 executados e aprovados:** 7 testes (6 unitários/em memória + 1 integrado real PostgreSQL).
- **Regressões:** Zero regressões detectadas no escopo do caso de uso `UC12`.
- **Status do Ambiente:** Plenamente estável e operacional.
