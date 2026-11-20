# ARTEFATO 13-04 — CENÁRIOS DE APOIO (RECURSO ORDERS)

## 1. Identificação do Recurso de Apoio
* **Recurso:** Pedidos (`Orders`).
* **Endpoint:** `POST /orders/:id/confirm`.
* **Controller:** `src/modules/orders/controllers/orders.controller.ts`.
* **Papel:** Recurso complementar existente no backend que serve para validar o comportamento de fronteira de rotas parametrizadas por UUID e tratamento de exceções de domínio.

---

## 2. Divisão em Grupos de Teste

### 2.1. Grupo A — Fronteira HTTP (Não Depende de Dados Existentes)
Cenários que testam pipes de validação e filtros globais antes ou imediatamente no início do fluxo de serviço, sem exigir registros pré-populados na base de dados.

| # | Cenário | Requisição | Esperado | Obtido | Conclusão |
|---|---|---|---|---|---|
| **1** | Identificador malformado (não-UUID) | `POST /orders/pedido-invalido-123/confirm` | `400 Bad Request`<br>`Validation failed (uuid is expected)` | `400 Bad Request`<br>`{"message":"Validation failed (uuid is expected)","error":"Bad Request","statusCode":400}` | **Aprovado** (`ParseUUIDPipe` atuando) |
| **2** | UUID sintaticamente válido mas inexistente | `POST /orders/00000000-0000-0000-0000-000000000000/confirm` | `404 Not Found`<br>`OrderNotFoundException` | `404 Not Found`<br>`{"statusCode":404,"message":"Order with id \"00000000-0000-0000-0000-000000000000\" was not found.","error":"OrderNotFoundException"}` | **Aprovado** (`DomainHttpExceptionFilter` e regra de negócio) |

---

### 2.2. Grupo B — Cenários Dependentes de Dados Existentes (Seed)
Cenários que necessitariam de dados pré-existentes no banco (ex.: pedido com pagamento aprovado para retornar `200 OK`, pedido com pagamento pendente retornando exceção, pedido já confirmado retornando `409 Conflict`).

* **Situação no Projeto CeliLac:**
  * O repositório **não possui script de seed implementado** (`seed:scenarios` inexiste em `package.json` e no código).
  * O banco de dados de desenvolvimento não possui pedidos pré-carregados de forma determinística.
* **Classificação Obrigatória (Seção 8 do Material 13):**
  * **Não foi possível verificar.**
  * Nenhum UUID fictício foi inventado nem mascarado como dado real nos arquivos de teste.
  * O arquivo `http-rest-client/orders/test-scenarios.http` documenta formalmente essa limitação no cabeçalho do Grupo B.
