# Artefato 4 — Sub-Issues Completas

Abaixo estão especificadas as 6 Sub-Issues decorrentes do planejamento do **UC12 — Cadastrar Produto**. Cada Sub-Issue está formatada em bloco Markdown individual, pronta para ser copiada e cadastrada no GitHub.

---

## Sub-Issue 01: [SUB-01] Modelar a Entidade de Domínio Product e Invariantes

```markdown
# [SUB-01] Modelar a Entidade de Domínio Product e Invariantes

## 1. Objetivo
Definir a entidade de domínio `Product` com encapsulamento de seus atributos essenciais e garantia das invariantes de negócio para cadastro de produtos.

## 2. Descrição Técnica
Criar a classe ou entidade de domínio responsável por representar o produto no módulo `src/modules/products/entities/product.entity.ts`. A entidade deve conter:
- Identificador único (`id`: string/UUID);
- Nome do produto (`name`: string);
- Preço (`price`: number/decimal);
- Timestamps de auditoria (`createdAt`, `updatedAt`);
- Métodos de validação/fábrica interna para assegurar que nenhuma instância de `Product` possa existir com nome vazio ou preço inválido.

## 3. Origem (Requisitos e Regras)
- Requisitos: RF01, RF02, RF04
- Regras de Negócio: RN01 (Nome obrigatório), RN02 (Validação do preço), RN03 (Integridade do cadastro)

## 4. Escopo e Responsabilidades
- **Dentro do escopo:** Definição da estrutura da entidade no domínio, métodos de verificação de integridade e tipos TypeScript estritos.
- **Fora do escopo:** Mapeamento ORM/banco de dados, persistência em disco ou exposição via HTTP.

## 5. Critérios de Aceite
- [ ] A entidade `Product` deve exigir atributos obrigatórios (`name`, `price`) em sua criação.
- [ ] A instanciação com nome nulo, vazio ou composto unicamente por espaços deve lançar erro de domínio.
- [ ] A instanciação com preço menor ou igual a zero (ou valor não numérico) deve lançar erro de domínio.
- [ ] O `id` deve ser gerado ou atribuído como UUID válido.

## 6. Dependências Técnicas
- **Pré-requisitos:** Nenhuma dependência direta de outra Sub-Issue.

## 7. Metadados e Alocação
- **Labels:** `domain`, `feature`, `priority:high`
- **Responsável:** A definir
- **Estado Inicial no Board:** `Ready`
- **Evidências Esperadas:** Código-fonte da entidade em `src/modules/products/entities/product.entity.ts` e testes unitários de domínio atestando as invariantes.
```

---

## Sub-Issue 02: [SUB-02] Implementar DTOs de Entrada e Saída com Validações de Contrato

```markdown
# [SUB-02] Implementar DTOs de Entrada e Saída com Validações de Contrato

## 1. Objetivo
Construir as estruturas de transferência de dados (DTOs) para a operação de cadastro de produtos, aplicando decorators de validação para validação sintática das requisições.

## 2. Descrição Técnica
Desenvolver em `src/modules/products/dtos/`:
- `create-product.dto.ts`: Estrutura do payload recebido via requisição HTTP, com validação de campo obrigatório para `name` (`@IsNotEmpty`, `@IsString`) e validação de `price` (`@IsNumber`, `@IsPositive`, `@Min(0.01)`).
- `product-response.dto.ts`: Estrutura de saída padronizada contendo os dados expostos do produto após criação (`id`, `name`, `price`, `createdAt`).

## 3. Origem (Requisitos e Regras)
- Requisitos: RF02, RF04, RF05
- Fluxos: FA01 (Nome obrigatório não informado), FA02 (Preço inválido)
- Regras de Negócio: RN01, RN02

## 4. Escopo e Responsabilidades
- **Dentro do escopo:** Criação das classes de DTO, anotações de validação (`class-validator` / `class-transformer`) e formatação das mensagens de erro.
- **Fora do escopo:** Lógica de negócio da aplicação, consultas a banco e endpoints de controle.

## 5. Critérios de Aceite
- [ ] O DTO `CreateProductDto` deve rejeitar requisições sem o atributo `name` com mensagem clara indicando obrigatoriedade.
- [ ] O DTO `CreateProductDto` deve rejeitar `price` menor ou igual a 0 ou tipos não numéricos com mensagem apropriada.
- [ ] O DTO `ProductResponseDto` deve expor apenas os campos definidos no contrato público da API.

## 6. Dependências Técnicas
- **Pré-requisitos:** Nenhuma dependência direta de outra Sub-Issue.

## 7. Metadados e Alocação
- **Labels:** `application`, `validation`, `priority:high`
- **Responsável:** A definir
- **Estado Inicial no Board:** `Ready`
- **Evidências Esperadas:** Arquivos de DTO implementados e testes de validação das anotações dos DTOs.
```

---

## Sub-Issue 03: [SUB-03] Configurar Persistência, Schema de Banco e Repositório de Produtos

```markdown
# [SUB-03] Configurar Persistência, Schema de Banco e Repositório de Produtos

## 1. Objetivo
Estruturar o esquema relacional para produtos, gerar migration do banco de dados e implementar o repositório de persistência.

## 2. Descrição Técnica
- Criar a migração TypeORM para a tabela `products` com colunas `id` (UUID, PK), `name` (VARCHAR, NOT NULL), `price` (DECIMAL/NUMERIC, NOT NULL), `created_at` e `updated_at`.
- Definir a interface de contrato `ProductRepository` em `src/modules/products/repositories/product.repository.interface.ts`.
- Implementar o repositório concreto `TypeOrmProductRepository` em `src/infrastructure/persistence/products/typeorm-product.repository.ts` com o método `create(product: Product): Promise<Product>`.
- Tratar falhas de comunicação com o banco de dados conforme as diretrizes da arquitetura.

## 3. Origem (Requisitos e Regras)
- Requisitos: RF03, RF04
- Fluxos: FE01 (Falha na persistência)
- Regras de Negócio: RN03, RN04

## 4. Escopo e Responsabilidades
- **Dentro do escopo:** Migration de criação de tabela, interface do repositório, implementação com TypeORM e injeção de dependência no módulo.
- **Fora do escopo:** Regras de negócio de aplicação ou rotas HTTP.

## 5. Critérios de Aceite
- [ ] A migration deve criar a tabela `products` no PostgreSQL com tipos, restrições e índices adequados.
- [ ] O método `create` do repositório deve salvar a entidade persistida e retornar a instância atualizada com identificador persistido.
- [ ] Falhas na conexão ou execução SQL devem ser capturadas e propagadas de forma segura (sem vazar dados de conexão).

## 6. Dependências Técnicas
- **Pré-requisitos:** `[SUB-01]` (Entidade `Product`).

## 7. Metadados e Alocação
- **Labels:** `infrastructure`, `database`, `priority:high`
- **Responsável:** A definir
- **Estado Inicial no Board:** `Backlog` (aguarda SUB-01)
- **Evidências Esperadas:** Arquivo de migration executável, classe do repositório implementada e testes de integração com banco de dados.
```

---

## Sub-Issue 04: [SUB-04] Implementar o Serviço de Aplicação para Cadastro de Produto

```markdown
# [SUB-04] Implementar o Serviço de Aplicação para Cadastro de Produto

## 1. Objetivo
Implementar o caso de uso no serviço de aplicação, coordenando a validação das regras de negócio, a instanciação do domínio e a persistência via repositório.

## 2. Descrição Técnica
Criar a classe de serviço `CreateProductService` em `src/modules/products/services/create-product.service.ts`:
- Receber `CreateProductDto`;
- Aplicar regras de negócio e validações adicionais do domínio;
- Instanciar a entidade `Product`;
- Chamar o método do `ProductRepository` para efetivar a gravação;
- Mapear a entidade persistida para o `ProductResponseDto` e retornar o resultado;
- Lançar exceções de domínio/aplicação apropriadas caso ocorra qualquer inconsistência.

## 3. Origem (Requisitos e Regras)
- Requisitos: RF01, RF02, RF03, RF04, RF05
- Regras de Negócio: RN01, RN02, RN03, RN04
- Fluxos: Fluxo Principal, FA01, FA02, FE01

## 4. Escopo e Responsabilidades
- **Dentro do escopo:** Orquestração do caso de uso, integração entre Domínio e Persistência e garantia de atomicidade.
- **Fora do escopo:** Tratamento específico de cabeçalhos/cookies HTTP ou chamadas diretas de SQL.

## 5. Critérios de Aceite
- [ ] O serviço deve orquestrar com sucesso a persistência quando receber dados válidos.
- [ ] O serviço não deve invocar o repositório se a entidade ou regras de validação forem violadas.
- [ ] Erros de negócio devem resultar em exceções tratáveis pela camada web.
- [ ] Falhas do repositório devem ser devidamente capturadas sem gerar dados corrompidos.

## 6. Dependências Técnicas
- **Pré-requisitos:** `[SUB-01]`, `[SUB-02]`, `[SUB-03]`.

## 7. Metadados e Alocação
- **Labels:** `application`, `feature`, `priority:high`
- **Responsável:** A definir
- **Estado Inicial no Board:** `Backlog` (aguarda SUB-01, SUB-02, SUB-03)
- **Evidências Esperadas:** Arquivo do serviço implementado e testes unitários cobrindo todos os cenários de sucesso e exceção com mocks do repositório.
```

---

## Sub-Issue 05: [SUB-05] Implementar o Controlador HTTP e Rota POST /products

```markdown
# [SUB-05] Implementar o Controlador HTTP e Rota POST /products

## 1. Objetivo
Disponibilizar o endpoint HTTP `POST /products` no NestJS, configurando pipes de validação, códigos de status e documentação Swagger.

## 2. Descrição Técnica
Desenvolver `ProductsController` em `src/modules/products/controllers/products.controller.ts`:
- Expor `@Post()` na rota base `/products`;
- Aplicar validação de corpo da requisição com `ValidationPipe` do NestJS;
- Injetar `CreateProductService` e delegar a execução;
- Configurar status HTTP `201 Created` para a resposta de sucesso com o `ProductResponseDto`;
- Adicionar anotações Swagger/OpenAPI (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) documentando retornos 201, 400 e 500;
- Registrar controller e serviço em `ProductsModule` e importar no `AppModule`.

## 3. Origem (Requisitos e Regras)
- Requisitos: RF01, RF04, RF05
- Critérios de Aceite do UC: CA01, CA02, CA03

## 4. Escopo e Responsabilidades
- **Dentro do escopo:** Camada de transporte HTTP, serialização de resposta, códigos de status e documentação OpenAPI.
- **Fora do escopo:** Implementação de consultas de banco de dados ou regras de negócio centrais.

## 5. Critérios de Aceite
- [ ] Requisições `POST /products` válidas devem retornar status HTTP 201 Created com o payload do produto criado.
- [ ] Requisições com corpo inválido devem receber status HTTP 400 Bad Request detalhando as falhas.
- [ ] A documentação Swagger deve exibir a rota `POST /products` com exemplos de requisição e resposta.
- [ ] O `ProductsModule` deve ser exportado e devidamente integrado ao ciclo de inicialização da aplicação.

## 6. Dependências Técnicas
- **Pré-requisitos:** `[SUB-02]`, `[SUB-04]`.

## 7. Metadados e Alocação
- **Labels:** `api`, `feature`, `priority:medium`
- **Responsável:** A definir
- **Estado Inicial no Board:** `Backlog` (aguarda SUB-02 e SUB-04)
- **Evidências Esperadas:** Controller implementado, módulo configurado no NestJS e verificação funcional da rota via cliente HTTP/Swagger.
```

---

## Sub-Issue 06: [SUB-06] Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)

```markdown
# [SUB-06] Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)

## 1. Objetivo
Garantir a qualidade, a regressão e a conformidade do UC12 através de testes automatizados unitários e de integração/ponta a ponta (E2E) com Vitest.

## 2. Descrição Técnica
Implementar a suíte de testes do caso de uso cobrindo:
- **Testes Unitários:**
  - `product.entity.spec.ts`: Testar criação válida e lançamentos de erro para nome vazio e preço <= 0.
  - `create-product.service.spec.ts`: Testar orquestração com mock de repositório, validação de regras de negócio e captura de erros.
- **Testes de Integração / E2E:**
  - `test/products/create-product.e2e-spec.ts`: Testar a rota `POST /products` via Supertest/Vitest:
    - Cenário 1: Envio de payload válido -> status 201 e registro existente no banco.
    - Cenário 2: Envio sem nome -> status 400 e ausência de persistência.
    - Cenário 3: Envio com preço inválido -> status 400 e ausência de persistência.
    - Cenário 4: Simulação de indisponibilidade de banco -> status 500 sem corrupção de dados.

## 3. Origem (Requisitos e Regras)
- Requisitos: RF01 a RF05
- Regras de Negócio: RN01 a RN04
- Fluxos: Principal, FA01, FA02, FE01
- Critérios de Aceite: CA01, CA02, CA03, CA04

## 4. Escopo e Responsabilidades
- **Dentro do escopo:** Scripts de teste unitário e E2E, fixtures e asserções de banco de dados.
- **Fora do escopo:** Modificações de código de produção não motivadas por correção de bugs identificados nos testes.

## 5. Critérios de Aceite
- [ ] 100% dos testes unitários de `Product` e `CreateProductService` passando com sucesso.
- [ ] Testes E2E cobrindo todas as respostas HTTP esperadas (201, 400, 500).
- [ ] Verificação explícita nos testes de que requisições com erro não persistem dados no banco relacional.

## 6. Dependências Técnicas
- **Pré-requisitos:** `[SUB-01]`, `[SUB-02]`, `[SUB-03]`, `[SUB-04]`, `[SUB-05]`.

## 7. Metadados e Alocação
- **Labels:** `test`, `quality`, `priority:medium`
- **Responsável:** A definir
- **Estado Inicial no Board:** `Backlog` (aguarda conclusão dos componentes técnicos)
- **Evidências Esperadas:** Relatório de execução dos testes com Vitest (`pnpm test` e `pnpm test:e2e`) com todos os testes passando.
```

