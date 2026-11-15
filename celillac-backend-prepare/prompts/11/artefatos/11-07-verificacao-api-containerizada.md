# ARTEFATO 11-07 — VERIFICAÇÃO DA API CONTAINERIZADA

## 1. Ambiente, Reconstrução da Imagem e Serviços

Após a criação de `ProductResponseDto` / `toProductResponse()` e a atualização de `ProductsController`, a imagem Docker foi reconstruída para garantir que o ambiente containerizado executasse o código recém-modificado:

```bash
docker compose up -d --build api
```

Verificação dos serviços (`docker compose ps`):

| Serviço | Contêiner | Imagem | Status | Portas |
| :--- | :--- | :--- | :--- | :--- |
| `api` | `celilac-api` | `celilac-api:dev` | `Up` (recriado após build) | `0.0.0.0:3200->3200/tcp` |
| `postgres` | `celilac-postgres` | `postgres:17` | `Up 2 weeks (healthy)` | `0.0.0.0:5432->5432/tcp` |
| `postgres_test` | `celilac-postgres-test` | `postgres:17` | `Up 9 hours (healthy)` | `0.0.0.0:5435->5432/tcp` |

Logs (`docker compose logs --tail=25 api`) confirmaram inicialização limpa de `TypeOrmCoreModule`, `ProductsModule`, `OrdersModule`, mapeamento `{/products, POST}` e escuta em `http://localhost:3200`.

---

## 2. Requisição HTTP na API Containerizada

```bash
curl -i -s -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto de exemplo"}'
```

### Resposta Observada
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 80
ETag: W/"50-7+9Y0lGRjshBq//JLw0Q0lbry0w"
Date: Fri, 13 Nov 2026 22:19:44 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"42e3bb18-e111-455b-bca4-884d5a6e14e9","name":"Produto de exemplo"}
```

### Comparação com o Contrato Definido
- **Status HTTP:** `201 Created` (conforme esperado).
- **Content-Type:** `application/json; charset=utf-8`.
- **Campos retornados:** `productId` (`string` UUID) e `name` (`"Produto de exemplo"`).
- **Ausência de campos adicionais:** Confirmada (apenas as 2 propriedades definidas em `ProductResponseDto`).
- **Divergências:** Nenhuma.

---

## 3. Confirmação no PostgreSQL (`celilac_db`)

```sql
SELECT * FROM products.products
WHERE "productId" = '42e3bb18-e111-455b-bca4-884d5a6e14e9';
```

Resultado observado:
```text
              productId               |        name        
--------------------------------------+--------------------
 42e3bb18-e111-455b-bca4-884d5a6e14e9 | Produto de exemplo
(1 row)
```

---

## 4. Distinção entre Evidências e Conclusão

- **Teste com Service simulado (`products.controller.spec.ts`):** verifica a fronteira HTTP, validação de entrada e filtragem de campos internos (`internalNote`).
- **Teste integrado (`typeorm-products.repository.postgres.spec.ts`):** verifica a interação real com o PostgreSQL no banco isolado `celilac_test`.
- **Requisição à API containerizada (`curl`):** verifica o contrato público entregue pelo contêiner `celilac-api` em execução.
- **Consulta PostgreSQL (`celilac_db`):** confirma a persistência efetiva dos dados no banco da aplicação.

**Conclusão:** O contrato público estabilizado (`ProductResponseDto` via `toProductResponse()`) está operando corretamente na imagem `celilac-api:dev` reconstruída, com persistência real confirmada no PostgreSQL.

