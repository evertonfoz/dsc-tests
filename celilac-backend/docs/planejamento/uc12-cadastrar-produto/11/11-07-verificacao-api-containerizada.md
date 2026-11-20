# ARTEFATO 11-07 — VERIFICAÇÃO DO CONTRATO NA API CONTAINERIZADA

## 1. Infraestrutura e Reconstrução da Imagem Docker

Como o código da aplicação foi atualizado (introdução de `src/modules/products/mappers/product-response.mapper.ts` e adaptação do `products.controller.ts`), a imagem de desenvolvimento da API foi reconstruída para refletir a nova versão compilada:

```bash
$ docker compose up -d --build api
```

### Evidência de Build e Status dos Serviços:
```
[+] up 3/3
 ✔ Image celilac-api:dev      Built                                         4.8s
 ✔ Container celilac-postgres Healthy                                       1.9s
 ✔ Container celilac-api      Started                                       2.0s
```

```bash
$ docker compose ps
NAME                    IMAGE             COMMAND                  SERVICE         CREATED          STATUS                    PORTS
celilac-api             celilac-api:dev   "docker-entrypoint.s…"   api             2 seconds ago    Up Less than a second     0.0.0.0:3200->3200/tcp, [::]:3200->3200/tcp
celilac-postgres        postgres:17       "docker-entrypoint.s…"   postgres        55 minutes ago   Up 55 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
celilac-postgres-test   postgres:17       "docker-entrypoint.s…"   postgres_test   7 days ago       Up 7 days (healthy)       0.0.0.0:5435->5432/tcp, [::]:5435->5432/tcp
```

### Logs de Inicialização do NestJS no Contêiner:
```
celilac-api  | [Nest] 1  - 11/20/2026, 1:17:12 PM     LOG [NestFactory] Starting Nest application...
celilac-api  | [Nest] 1  - 11/20/2026, 1:17:12 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +15ms
celilac-api  | [Nest] 1  - 11/20/2026, 1:17:12 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 1:17:12 PM     LOG [RoutesResolver] ProductsController {/products}: +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 1:17:12 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 1:17:12 PM     LOG [NestApplication] Nest application successfully started +0ms
celilac-api  | Server is running on http://localhost:3200
```

---

## 2. Execução das Requisições HTTP Reais contra o Contêiner

Foram executados testes manuais e automatizados via `curl` contra a porta exposta `3200`:

### 2.1 Requisição de Sucesso (Validação do Contrato Público)
```bash
$ curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Bolo de Cenoura Sem Gluten"}'
```

**Resposta Observada:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 88
ETag: W/"58-+yxVt0kT/qM0LoqL7tkA+sES21c"
Date: Fri, 20 Nov 2026 13:19:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"9a02a4af-6c2d-4752-b218-1ea119916624","name":"Bolo de Cenoura Sem Gluten"}
```

*Análise:*
- Status `201 Created` comprovado.
- Cabeçalho `Content-Type: application/json; charset=utf-8`.
- Estrutura estritamente conforme `ProductResponseDto` (`productId` e `name`).
- Identificador gerado: `9a02a4af-6c2d-4752-b218-1ea119916624`.

---

### 2.2 Requisição com Propriedades Não Mapeadas na Entrada
```bash
$ curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Pao Frances Sem Gluten","extraProperty":"ignored"}'
```

**Resposta Observada:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 84
ETag: W/"54-oqSV8aIvyMqG1U079PmYXUaq0A0"
Date: Fri, 20 Nov 2026 13:19:13 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"48e580f3-b467-48e3-8030-dd9ae54a3f38","name":"Pao Frances Sem Gluten"}
```

*Análise:* O campo `extraProperty` foi descartado pelo `ValidationPipe` (`whitelist: true`) e a resposta final permaneceu estritamente purificada pelo mapper HTTP.

---

### 2.3 Requisições de Entrada Inválida
```bash
$ curl -i -s -X POST http://localhost:3200/products -H "Content-Type: application/json" -d '{"name":""}'
# Retornou: 400 Bad Request {"message":["name should not be empty"],"error":"Bad Request","statusCode":400}

$ curl -i -s -X POST http://localhost:3200/products -H "Content-Type: application/json" -d '{}'
# Retornou: 400 Bad Request {"message":["name should not be empty","name must be a string"],"error":"Bad Request","statusCode":400}

$ curl -i -s -X POST http://localhost:3200/products -H "Content-Type: application/json" -d '{"name":12345}'
# Retornou: 400 Bad Request {"message":["name must be a string"],"error":"Bad Request","statusCode":400}
```

---

## 3. Confirmação Direta de Persistência no PostgreSQL de Desenvolvimento

Para comprovar que o cadastro efetuado através da API containerizada foi efetivamente persistido no banco de dados relacional, foi executada consulta SQL direta no contêiner `celilac-postgres`:

```bash
$ docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT * FROM products.products WHERE \"productId\" = '\''9a02a4af-6c2d-4752-b218-1ea119916624'\'';"'
```

**Resultado Retornado:**
```
              productId               |            name            
--------------------------------------+----------------------------
 9a02a4af-6c2d-4752-b218-1ea119916624 | Bolo de Cenoura Sem Gluten
(1 row)
```

---

## 4. Distinção Rigorosa dos Quatro Níveis de Evidência

| Nível de Evidência | Componentes Envolvidos | O Que Comprova | Arquivo / Comando |
| :--- | :--- | :--- | :--- |
| **1. Teste Unitário HTTP** | `ProductsController`, `ValidationPipe`, Mock do Service | Comportamento da fronteira HTTP e filtragem de campos internos. | `products.controller.spec.ts` |
| **2. Teste de Integração Real** | Adaptador TypeORM, Banco PostgreSQL de Testes (`celilac-postgres-test`) | Conformidade com o schema SQL relacional em banco real. | `typeorm-products.repository.postgres.spec.ts` |
| **3. Requisição Containerizada** | API NestJS completa rodando no Docker (`celilac-api`), portas publicadas | Contrato HTTP ponta a ponta no ambiente final de implantação. | `curl -X POST http://localhost:3200/products` |
| **4. Consulta SQL Direta** | PostgreSQL de Desenvolvimento (`celilac-postgres`) | Persistência física dos dados no volume de banco `celilac_postgres_data`. | `SELECT * FROM products.products` |

Essas evidências são **complementares e indissociáveis**, assegurando a robustez da aplicação em todas as suas camadas.
