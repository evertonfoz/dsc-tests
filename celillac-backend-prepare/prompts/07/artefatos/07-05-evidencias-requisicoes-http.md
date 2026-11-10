# ARTEFATO 07-05 — EVIDÊNCIAS DE EXECUÇÃO DE REQUISIÇÕES HTTP

## 1. Ambiente e Configuração de Execução

| Parâmetro | Valor Verificado |
| :--- | :--- |
| **Sistema Operacional** | macOS Darwin (arm64) |
| **Runtime e Framework** | Node.js, NestJS (`^12.1.2`), Express |
| **Comando de Inicialização** | `pnpm build && node dist/main.js` |
| **Endereço e Porta** | `http://localhost:3200` (`process.env.PORT \|\| 3200`) |
| **Endpoint Testado** | `POST http://localhost:3200/products` |
| **Ferramentas HTTP Utilizadas** | `curl` (`curl -i -s -X POST`) e arquivos REST Client em `http-rest-client/products/` (`product-controller.http` e `test-scenarios.http`) |
| **Pipe de Validação Ativo** | `ValidationPipe({ whitelist: true, transform: true })` |
| **Repositório Configurado no Módulo** | `InMemoryProductsRepository` (associado ao token `PRODUCTS_REPOSITORY`) |

---

## 2. Cenário 1 — Requisição Válida (Cadastro de Produto com Sucesso)

### 2.1 Especificação e Comando Executado
- **Método e Endpoint:** `POST /products`
- **Cabeçalho:** `Content-Type: application/json`
- **Payload enviado:**
  ```json
  {
    "name": "Celular XYZ"
  }
  ```
- **Comando executado:**
  ```bash
  curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name": "Celular XYZ"}'
  ```

### 2.2 Resposta HTTP Real Obtida
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 73
ETag: W/"49-wRfWgQyNHT3EMktlx/7KWqQEvSI"
Date: Sun, 08 Nov 2026 15:34:48 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"ea0a063e-7f8d-44a8-875e-9239df45a0ff","name":"Celular XYZ"}
```

### 2.3 Análise Técnica do Resultado Observado
- **Resultado esperado:** Código `201 Created` e corpo JSON contendo `productId` (UUID gerado) e `name: "Celular XYZ"`.
- **Resultado observado:** Código `201 Created` e corpo `{"productId":"ea0a063e-7f8d-44a8-875e-9239df45a0ff","name":"Celular XYZ"}`.
- **Conclusão do Cenário 1:** A requisição passou pela validação do `CreateProductDto`, acionou `ProductsController.create`, delegou para `ProductsService.createProduct("Celular XYZ")`, armazenou a entidade em `InMemoryProductsRepository` e devolveu a instância serializada respeitando o contrato `Product(productId, name)`.

---

## 3. Cenário 2 — Requisição Inválida (Rejeição de Nome Vazio na Fronteira HTTP)

### 3.1 Especificação e Comando Executado
- **Método e Endpoint:** `POST /products`
- **Cabeçalho:** `Content-Type: application/json`
- **Payload enviado:**
  ```json
  {
    "name": ""
  }
  ```
- **Comando executado:**
  ```bash
  curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name": ""}'
  ```

### 3.2 Resposta HTTP Real Obtida
```http
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-vYNkcW5F6SbXFYfU19PSOJCiOds"
Date: Sun, 08 Nov 2026 15:34:48 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}
```

### 3.3 Análise Técnica do Resultado Observado
- **Resultado esperado:** Rejeição na fronteira HTTP com código `400 Bad Request` e mensagem de violação da restrição `@IsNotEmpty()`.
- **Resultado observado:** Código `400 Bad Request` e corpo `{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}`.
- **Conclusão do Cenário 2:** O `ValidationPipe` interceptou o payload inválido a partir do metadado `@IsNotEmpty()` de `CreateProductDto`, bloqueando a execução antes da chamada a `ProductsController.create` e `ProductsService.createProduct`.

---

## 4. Quadro Resumo das Evidências HTTP

| # | Cenário | Método e Rota | Payload Enviado | Status Esperado | Status Observado | Corpo da Resposta Observada | Situação |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- | :---: |
| **1** | Cadastro com dados válidos | `POST /products` | `{"name": "Celular XYZ"}` | `201 Created` | `201 Created` | `{"productId":"ea0a063e-7f8d-44a8-875e-9239df45a0ff","name":"Celular XYZ"}` | **Aprovado** |
| **2** | Rejeição de nome vazio | `POST /products` | `{"name": ""}` | `400 Bad Request` | `400 Bad Request` | `{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}` | **Aprovado** |

---

## 5. Limites Metodológicos e Pendências

1. **Validação de Fronteira HTTP vs. Camada de Aplicação (`CA02`):** A resposta `400 Bad Request` no Cenário 2 comprova que a **fronteira HTTP** rejeita nomes vazios via `ValidationPipe` + `CreateProductDto`. Ela **não** comprova que `ProductsService.createProduct` possua essa regra internamente; o desenvolvimento de `CA02` no serviço/domínio permanece pendente para ciclo TDD próprio.
2. **Persistência em Memória:** O produto criado no Cenário 1 foi salvo em `InMemoryProductsRepository`. A persistência real em banco de dados PostgreSQL será implementada na `SUB-04` (Issue #7).

