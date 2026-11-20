# ARTEFATO 09-06 — EVIDÊNCIAS DE PERSISTÊNCIA REAL E DURABILIDADE NO POSTGRESQL

## 1. Ambiente de Execução

| Parâmetro | Valor Real Verificado |
| :--- | :--- |
| **Data e Hora da Execução** | `2026-11-09` (`20:28:12 GMT` / `17:28:12 -03:00`) |
| **Branch Ativa** | `feature/uc12-04-products-persistence` |
| **Comando de Inicialização (Instância 1)** | `node dist/main.js` (PID `41187`) |
| **Endpoint Exercitado** | `POST http://localhost:3200/products` |
| **Banco de Dados Conectado** | PostgreSQL 17 (`celilac-postgres`, `127.0.0.1:5432`, banco `celilac_db`) |
| **Fluxo Executado** | `Cliente HTTP → ProductsController → ProductsService → ProductsRepository → TypeOrmProductsRepository → ProductMapper → TypeORM → PostgreSQL` |

### Log Real de Inicialização (Instância 1 — PID `41187`):
```text
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [NestFactory] Starting Nest application...
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +5ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] AppModule dependencies initialized +16ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +37ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [InstanceLoader] OrdersModule dependencies initialized +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [RoutesResolver] AppController {/}: +11ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [RouterExplorer] Mapped {/, GET} route +1ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [RoutesResolver] OrdersController {/orders}: +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [RouterExplorer] Mapped {/orders/:id/confirm, POST} route +1ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [RoutesResolver] ProductsController {/products}: +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
[Nest] 41187  - 11/09/2026, 5:27:46 PM     LOG [NestApplication] Nest application successfully started +0ms
Server is running on http://localhost:3200
```

---

## 2. Etapa 1 — Execução do Cadastro HTTP (`POST /products`)

### 2.1 Requisição e Comando Executado
```bash
curl -i -s -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Produto de exemplo"}'
```

### 2.2 Resposta HTTP Real Observada
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 80
ETag: W/"50-ojI0Z8t5laeGKywjm0zz13Xm0BA"
Date: Mon, 09 Nov 2026 20:28:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"256824a7-a374-4baf-8c95-492e870ee999","name":"Produto de exemplo"}
```

| Atributo da Resposta | Valor Obtido |
| :--- | :--- |
| **Código HTTP** | `201 Created` |
| **Corpo JSON** | `{"productId":"256824a7-a374-4baf-8c95-492e870ee999","name":"Produto de exemplo"}` |
| **`productId` Gerado** | `256824a7-a374-4baf-8c95-492e870ee999` |
| **`name` Persistido** | `Produto de exemplo` |

---

## 3. Etapa 2 — Consulta Direta ao PostgreSQL (Antes da Reinicialização do Backend)

Sem criar nenhum endpoint `GET /products` artificial, consultou-se diretamente a tabela `products.products` no contêiner `celilac-postgres` utilizando o `productId` retornado na resposta HTTP (`256824a7-a374-4baf-8c95-492e870ee999`):

- **Comando executado:**
  ```bash
  docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT * FROM products.products WHERE \"productId\" = '256824a7-a374-4baf-8c95-492e870ee999';"
  ```
- **Resultado SQL real observado (Antes do Reinício):**
  ```text
                productId               |        name        
  --------------------------------------+--------------------
   256824a7-a374-4baf-8c95-492e870ee999 | Produto de exemplo
  (1 row)
  ```

---

## 4. Etapa 3 — Comprovação de Durabilidade Após Reinicialização do Backend

### 4.1 Encerramento e Reinicialização Somente do Backend
1. **Encerramento da Instância 1 (`PID 41187`):** O processo Node.js do backend foi encerrado, destruindo toda a memória RAM do processo da aplicação (enquanto o contêiner `celilac-postgres` e seu volume permaneceram ativos).
2. **Inicialização da Instância 2 (`PID 41334`):** Um novo processo `node dist/main.js` foi iniciado:
   ```text
   [Nest] 41334  - 11/09/2026, 5:29:00 PM     LOG [NestFactory] Starting Nest application...
   ...
   [Nest] 41334  - 11/09/2026, 5:29:00 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +0ms
   [Nest] 41334  - 11/09/2026, 5:29:00 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
   [Nest] 41334  - 11/09/2026, 5:29:00 PM     LOG [NestApplication] Nest application successfully started +1ms
   Server is running on http://localhost:3200
   ```

### 4.2 Nova Consulta SQL Após Reinicialização do Backend
- **Comando executado:**
  ```bash
  docker exec celilac-postgres psql -U celilac_user -d celilac_db -c "SELECT * FROM products.products WHERE \"productId\" = '256824a7-a374-4baf-8c95-492e870ee999';"
  ```
- **Resultado SQL real observado (Após o Reinício):**
  ```text
                productId               |        name        
  --------------------------------------+--------------------
   256824a7-a374-4baf-8c95-492e870ee999 | Produto de exemplo
  (1 row)
  ```

### 4.3 Comparação Antes vs. Depois da Reinicialização

| Momento da Verificação | Processo Backend (PID) | `productId` no PostgreSQL | `name` no PostgreSQL | Linhas Encontradas |
| :--- | :---: | :--- | :--- | :---: |
| **Antes do reinício** | `PID 41187` | `256824a7-a374-4baf-8c95-492e870ee999` | `Produto de exemplo` | `1 row` |
| **Após encerramento de `41187` e subida de `41334`** | `PID 41334` | `256824a7-a374-4baf-8c95-492e870ee999` | `Produto de exemplo` | `1 row` |

---

## 5. Conclusão Técnica

A igualdade exata do registro `256824a7-a374-4baf-8c95-492e870ee999` (`"Produto de exemplo"`) antes e depois do encerramento completo do processo Node.js (`PID 41187` → `PID 41334`) comprova empiricamente a **durabilidade dos dados em armazenamento não volátil (PostgreSQL)**, superando a limitação estrutural de volatilidade do `InMemoryProductsRepository` documentada no Material 08.

