# ARTEFATO 13-01 — DIAGNÓSTICO DA VERIFICAÇÃO HTTP E ESTADO ATUAL

## 1. Identificação do Projeto e Contexto
* **Projeto:** CeliLac — Backend NestJS (`evertonfoz/dsc-tests`).
* **Caso de Uso:** `UC12 — Cadastrar Produto` (`POST /products`).
* **Recurso de Apoio:** `Orders` (`POST /orders/:id/confirm`).
* **Etapa Anterior:** Material 12 — Auditoria Arquitetural e Refatoração Orientada por Evidências (artefatos presentes em `docs/planejamento/uc12-cadastrar-produto/12/`).
* **Objetivo do Material 13:** Criar uma coleção versionada de requisições HTTP (`http-rest-client/`), documentação operacional (`README.md`) e script automatizado com asserções (`run-checks.sh`) para verificação reproduzível em ambiente local e containerizado.

---

## 2. Inspeção do Código-Fonte e Contratos Reais

### 2.1. Ponto de Entrada da Aplicação (`src/main.ts`)
* **Porta:** `process.env.PORT || 3200` (porta confirmada em execução: `3200`).
* **Pipes Globais:** `ValidationPipe` com `whitelist: true` e `transform: true`.
  * Propriedades não mapeadas no DTO de entrada são sumariamente descartadas sem rejeição de erro (`whitelist: true`).
* **Prefixo Global:** Nenhum prefixo global configurado (rotas mapeadas diretamente a partir da raiz `/`).

### 2.2. Contrato do Caso de Uso Principal (`UC12 — Cadastrar Produto`)
* **Controller:** `src/modules/products/controllers/products.controller.ts`
  * Rota: `POST /products`
  * Código de Sucesso Padrão: `201 Created`
* **DTO de Entrada:** `src/modules/products/dtos/create-product.dto.ts`
  * Campo: `name!: string`
  * Validadores: `@IsString()`, `@IsNotEmpty()`
  * Comportamentos esperados:
    * `name` ausente (`{}`): `400 Bad Request`
    * `name` vazio (`""`): `400 Bad Request`
    * `name` com tipo numérico/booleano: `400 Bad Request`
    * Propriedade extra enviada: `201 Created`, descartando o campo extra do objeto recebido.
* **DTO de Resposta:** `ProductResponseDto` via `src/modules/products/mappers/product-response.mapper.ts`
  * Contrato de saída: `{ "productId": "<UUID>", "name": "<string>" }`.
* **Persistência Relacional:**
  * Banco de Dados: `celilac_db`
  * Schema e Tabela: `products.products`
  * Colunas: `productId uuid PRIMARY KEY`, `name varchar(120) NOT NULL`.

### 2.3. Contrato do Recurso de Apoio (`Orders`)
* **Controller:** `src/modules/orders/controllers/orders.controller.ts`
  * Rota: `POST /orders/:id/confirm`
  * Validador do Parâmetro: `@Param('id', new ParseUUIDPipe())`
  * Comportamentos esperados:
    * ID não-UUID (ex.: `abc`): `400 Bad Request` (`Validation failed (uuid is expected)`)
    * ID UUID válido, mas pedido inexistente: `404 Not Found` (`OrderNotFoundException`)
    * Pedido existente aprovado (`200 OK`): depende de dados existentes no banco.

### 2.4. Rota de Sanidade (Smoke / Raiz)
* **Controller:** `src/app.controller.ts`
  * Rota: `GET /`
  * Resposta: `200 OK` com texto plano `Hello World!`.
* **Rota Inexistente:**
  * Requisição: `GET /not-found-route`
  * Resposta: `404 Not Found` (JSON padrão do NestJS).

---

## 3. Inspeção do Ambiente e Infraestrutura

### 3.1. Docker Compose (`compose.yaml`)
* **Serviços Definidos:**
  * `api` (`celilac-api`): imagem `celilac-api:dev`, porta mapeada `3200:3200`, depende de `postgres` saudável (`service_healthy`).
  * `postgres` (`celilac-postgres`): imagem `postgres:17`, porta `5432:5432`, banco `celilac_db`, usuário `celilac_user`, healthcheck com `pg_isready`.
  * `postgres_test` (`celilac-postgres-test`): imagem `postgres:17`, porta `5435:5432`, banco `celilac_test`, estritamente isolado para testes automatizados.
* **Estado dos Contêineres Observado:**
  * `celilac-api`: Status `Up` (porta `3200`).
  * `celilac-postgres`: Status `Up (healthy)` (porta `5432`).
  * `celilac-postgres-test`: Status `Up (healthy)` (porta `5435`).
* **Migrations no Banco de Produção/Desenvolvimento:**
  * Execução de `typeorm migration:show -d dist/database/data-source.js` reporta:
    * `[X] 1 CreateOrders1792519198708`
    * `[X] 6 CreateProductsTable1794255600000`
    * Total de migrações pendentes: **0**.

### 3.2. Scripts e Mecanismo de Seed
* Inspecionando `package.json` e o diretório `src/scripts/`, constata-se:
  * Não há script `seed:scenarios` configurado no repositório.
  * O arquivo `src/scripts/verify-persistence.ts` existe, mas atua apenas como script de verificação de persistência pontual via NestJS, e não como gerador/populador de dados determinísticos para pedidos.
  * Conclusão sobre cenários que exigem registros pré-existentes de pedidos (Grupo B): **Não foi possível verificar**, evitando a criação fictícia de UUIDs.

---

## 4. Diagnóstico da Pasta `http-rest-client/`

### 4.1. Situação Encontrada
* Diretório existente: `http-rest-client/`
* Arquivos presentes:
  * `http-rest-client/order-controller.http` (arquivo solto na raiz da pasta, sem padronização de títulos, sem cenários do caso de uso principal `products`, sem pasta `containerizado/`, sem README operacional e sem script automatizado).

### 4.2. Lacunas Identificadas
1. **Ausência da Estrutura Modular:** Não há divisão em `tests/`, `products/`, `orders/` e `containerizado/`.
2. **Ausência do Caso de Uso Principal:** Não existem arquivos `.http` para o cadastro de produtos (`UC12`).
3. **Ausência de Encadeamento:** Não há uso de anotações `# @name` e variáveis dinâmicas do REST Client para capturar o `productId` retornado e conferir na persistência.
4. **Ausência de Script Automatizado:** Não existe o script `run-checks.sh` com asserções, contadores `pass`/`fail` e código de saída semântico.
5. **Ausência de Documentação Operacional:** Não há `README.md` detalhando pré-requisitos, consultas SQL seguras e limites de execução.

---

## 5. Plano de Implementação para o Material 13

1. **Reestruturar o diretório `http-rest-client/`**:
   * Criar `http-rest-client/tests/hello-world.http` (smoke tests).
   * Criar `http-rest-client/products/uc12-cadastrar-produto/products-controller.http` e `test-scenarios.http` (UC12).
   * Migrar e padronizar `http-rest-client/orders/orders-controller.http` e `test-scenarios.http` (recurso de apoio).
   * Criar a pasta `http-rest-client/containerizado/` com `README.md`, `00-smoke.http`, `01-products-cadastrar-produto.http`, `02-orders-fronteira.http` e `run-checks.sh`.
2. **Executar requisições reais** e documentar cada status obtido.
3. **Validar o script `run-checks.sh`** com `bash -n`, execução normal, execução com `--durability` e prova de detecção de falha.
4. **Elaborar os 8 artefatos Markdown** registrando fatos técnicos sem dados inventados.
