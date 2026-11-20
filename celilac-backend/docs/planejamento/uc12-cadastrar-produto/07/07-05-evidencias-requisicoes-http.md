# ARTEFATO 07-05 — EVIDÊNCIAS DE EXECUÇÃO DE REQUISIÇÕES HTTP REAIS

> **Material 07 — Da Aplicação à API HTTP com NestJS**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 06

---

## 1. Ambiente de Execução e Ferramental de Teste

- **Host da Aplicação:** `http://localhost:3210`
- **Mecanismo de Execução:** Servidor NestJS compilado (`node dist/main.js`) rodando em ambiente local.
- **Cliente HTTP Utilizado:** `cURL 8.7.1` e arquivos `.http` compatíveis com a extensão REST Client.
- **Filtro de Validação:** `ValidationPipe` global ativo com `whitelist: true` e `transform: true`.

---

## 2. Cenário 1 — Requisição com Dados Válidos (Sucesso)

### 2.1 Requisição Enviada
```bash
curl -i -X POST http://localhost:3210/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Celular XYZ"}'
```

### 2.2 Resposta HTTP Real Recebida
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 73
ETag: W/"49-l7TIKtFz/eStAzuCogH3B/26QGc"
Date: Fri, 20 Nov 2026 01:25:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"15b2743a-b764-4da0-8ef7-a33f675559ed","name":"Celular XYZ"}
```

### 2.3 Análise do Cenário Válido:
- **Status Code:** `201 Created` retornado corretamente em conformidade com as convenções REST para criação de recursos.
- **Identificador Único:** O `productId` gerado é um UUID v4 válido (`15b2743a-b764-4da0-8ef7-a33f675559ed`), produzido via `randomUUID()` da biblioteca nativa `node:crypto`.
- **Integridade dos Dados:** O atributo `name` retornou com o valor exatamente fornecido na requisição.
- **Atendimento de Requisito:** Comprova o cumprimento do critério `CA01` na fronteira HTTP.

---

## 3. Cenário 2 — Requisição com Dados Inválidos (Nome Vazio)

### 3.1 Requisição Enviada
```bash
curl -i -X POST http://localhost:3210/products \
  -H "Content-Type: application/json" \
  -d '{"name":""}'
```

### 3.2 Resposta HTTP Real Recebida
```http
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-vYNkcW5F6SbXFYfU19PSOJCiOds"
Date: Fri, 20 Nov 2026 01:25:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}
```

### 3.3 Análise do Cenário Inválido:
- **Status Code:** `400 Bad Request` retornado automaticamente pelo `ValidationPipe`.
- **Mensagem Semântica:** A mensagem `"name should not be empty"` decorre diretamente da violação do decorator `@IsNotEmpty()` presente na propriedade `name` do `CreateProductDto`.
- **Interrupção de Fluxo:** A requisição foi interceptada antes de invocar o `ProductsService` ou o repositório, protegendo as camadas internas da aplicação.

---

## 4. Cenário Adicional — Verificação de Sanitização de Payload (`whitelist: true`)

Para atestar a proteção contra propriedades maliciosas ou não documentadas:

### 4.1 Requisição Enviada
```bash
curl -i -X POST http://localhost:3210/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Notebook ABC","unknownField":"hack"}'
```

### 4.2 Resposta HTTP Real Recebida
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-GsQwqZjdTpXj9WbJcv31rJoKNrY"
Date: Fri, 20 Nov 2026 01:25:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"94073d1b-26ff-4b0a-a6e6-e90cf66b3266","name":"Notebook ABC"}
```

**Diagnóstico:** A propriedade `unknownField` foi descartada silenciosamente pelo `whitelist: true` do `ValidationPipe`, confirmando a conformidade estrita com o DTO.
