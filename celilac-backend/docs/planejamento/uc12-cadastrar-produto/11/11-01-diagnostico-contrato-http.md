# ARTEFATO 11-01 — DIAGNÓSTICO DO CONTRATO HTTP, PRONTIDÃO E LINHA DE BASE

## 1. Identificação do Projeto, Caso de Uso e Atividade

| Elemento | Valor Verificado no Repositório e Artefatos |
| :--- | :--- |
| **Projeto** | CeliLac — Plataforma para Celíacos e Intolerantes a Lactose (`celilac-backend`) |
| **Repositório GitHub** | [`evertonfoz/dsc-tests`](https://github.com/evertonfoz/dsc-tests) |
| **Caso de Uso** | `UC12 — Cadastrar Produto` (`prompts/uc-12.md`) |
| **Issue Principal (Epic)** | [`EPIC-UC12 — [UC12] Cadastrar Produto` (Issue #1)](https://github.com/evertonfoz/dsc-tests/issues/1) |
| **Issue da Atividade Atual** | [`SUB-02 — [UC12][Contratos] Criar DTO de cadastro de produto` (Issue #5)](https://github.com/evertonfoz/dsc-tests/issues/5) e correlatas de testes/fronteira ([#9 SUB-06](https://github.com/evertonfoz/dsc-tests/issues/9) e [#10 SUB-07](https://github.com/evertonfoz/dsc-tests/issues/10)) |
| **Branch de Trabalho** | `feature/uc12-10-http-contract-stabilization` (ou branch integrada à `main`) |
| **Branch Anterior (Material 10)** | `feature/uc12-09-backend-containerization` |
| **Pull Request Associado** | [PR #19 — `test(uc12): stabilize and verify HTTP contract for POST /products`](https://github.com/evertonfoz/dsc-tests/pull/19) |
| **Artefatos Anteriores Recuperados** | `docs/planejamento/uc12-cadastrar-produto/10/10-01-diagnostico-containerizacao.md` a `10-08-versionamento-checklist.md` |
| **Diretório de Destino desta Atividade** | `docs/planejamento/uc12-cadastrar-produto/11/` |

---

## 2. Contratos Existentes e Arquitetura do Caso de Uso UC12

A recuperação da documentação do Material 10 e a inspeção direta da base de código confirmaram a integridade da arquitetura em camadas do módulo de produtos:

1. **Entidade de Domínio (`Product`):**
   - Arquivo: `src/modules/products/entities/product.entity.ts`
   - Atributos: `productId: string` (identificador único), `name: string` (nome comercial).
   - Invariante: classe pura de domínio TypeScript, sem decorators de framework ou persistência.
2. **Repositório de Domínio (`ProductsRepository`):**
   - Arquivo: `src/modules/products/repositories/products.repository.interface.ts`
   - Invariante: token `PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY'`, método `save(product: Product): Promise<Product>`.
3. **Serviço de Aplicação (`ProductsService`):**
   - Arquivo: `src/modules/products/services/products.service.ts`
   - Invariante: método `createProduct(name: string): Promise<Product>`, instancia `Product` com `randomUUID()` e delega a persistência ao repositório injetado.
4. **Fronteira HTTP (`ProductsController` e `CreateProductDto`):**
   - Arquivos: `src/modules/products/controllers/products.controller.ts`, `src/modules/products/dtos/create-product.dto.ts`
   - Rota: `POST /products`, escutando na porta `3200`.
   - DTO de Entrada: `CreateProductDto` com `@IsString()` e `@IsNotEmpty()` sobre a propriedade `name`.
   - `ValidationPipe`: configurado globalmente em `src/main.ts` com `{ whitelist: true, transform: true }`.
5. **Persistência Real em PostgreSQL:**
   - Schema/Tabela: `products.products` com colunas `"productId" (varchar/uuid)` e `"name" (varchar)`.
   - Entidade ORM e Mapper: isolados em `src/infrastructure/persistence/products/`.
   - Contêineres Compose: `celilac-api` (porta 3200), `celilac-postgres` (porta 5432) e `celilac-postgres-test` (porta 5435).

---

## 3. Diagnóstico do Contrato HTTP Anterior

Antes da intervenção do Material 11, o método `createProduct` do `ProductsController` estava implementado como:

```typescript
@Post()
async createProduct(@Body() createProductDto: CreateProductDto) {
  return this.productsService.createProduct(createProductDto.name);
}
```

### Análise das Vulnerabilidades Arquiteturais Observadas:
1. **Acoplamento Direto com o Domínio:** O Controller devolvia diretamente o retorno do Service (`Promise<Product>`). Embora em JavaScript puro o JSON resultante fosse `{ "productId": "...", "name": "..." }`, a serialização HTTP estava implicitamente amarrada aos atributos da entidade de domínio.
2. **Risco de Vazamento de Propriedades Internas:** Se novos atributos internos ou notas de auditoria fossem adicionados à entidade de domínio ou injetados por repositórios/serviços simulados, tais propriedades vazariam imediatamente no corpo da resposta JSON sem nenhum filtro.
3. **Ausência de DTO de Resposta Explícito:** O consumidor da API não possuía uma interface de contrato público formalizada para o payload de saída (`ProductResponseDto`), dificultando a geração de SDKs, contratos OpenAPI e garantias de tipagem.
4. **Fragilidade dos Testes HTTP Anteriores:** Os testes automatizados em `products.controller.spec.ts` verificavam o retorno de sucesso apenas contra o mock simples, sem testar a resiliência contra vazamento de campos internos.

---

## 4. Linha de Base dos Testes Automatizados (Execução Real)

Para assegurar a não regressão, foram executadas as suítes aplicáveis ao caso de uso antes de qualquer modificação contratual:

### 4.1 Suíte Rápida do UC12 (Vitest em Memória)
```bash
$ pnpm vitest run src/modules/products/ src/app.controller.spec.ts

 ✓ src/app.controller.spec.ts (1 test) 102ms
 ✓ src/modules/products/services/products.service.spec.ts (1 test) 67ms
 ✓ src/modules/products/controllers/products.controller.spec.ts (2 tests) 73ms
 ✓ src/modules/products/products.integration.spec.ts (2 tests) 64ms

 Test Files  4 passed (4)
      Tests  6 passed (6)
   Duration  598ms
```

### 4.2 Suíte de Persistência PostgreSQL (`pnpm test:integration`)
```bash
$ vitest run --config ./vitest.integration.config.ts

 ✓ src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts (1 test) 72ms
   ✓ TypeOrmProductsRepository — persistência real no PostgreSQL (1)
     ✓ deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco 16ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  299ms
```

*Status da Linha de Base:* **100% dos testes do UC12 aprovados (6 testes em memória + 1 teste PostgreSQL real)**. A suíte legada `test:e2e` conecta ao banco de desenvolvimento e permanece isolada fora do escopo desta verificação para prevenir mutações acidentais de dados de desenvolvimento.

---

## 5. Inspeção do Contrato HTTP Operacional via Requisição Real

Com o serviço `celilac-api` rodando no Docker Compose (porta 3200), foi enviada requisição real de validação inicial:

```bash
$ curl -i -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Produto de exemplo"}'
```

**Resposta Observada:**
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 80
ETag: W/"50-y9qEnSlhgpqU7c3wVd88URBoAhg"
Date: Fri, 20 Nov 2026 13:15:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"8263e96a-33e3-4255-af85-8c4de390f266","name":"Produto de exemplo"}
```

*Diagnóstico:* A API responde com status `201 Created` e devolve `productId` e `name`. Contudo, é mandatório formalizar o DTO de resposta e o mapper HTTP para blindar essa representação contra acoplamento indevido.

---

## 6. Plano de Execução do Material 11

1. **Definição Explícita do Contrato Público:** Especificar formalmente campos, tipos, obrigatoriedade e propósitos (Artefato 11-02).
2. **Criação do DTO e Mapper de Resposta:** Implementar `ProductResponseDto` e a função pura `toProductResponse` em `src/modules/products/mappers/product-response.mapper.ts` (Artefato 11-03).
3. **Adaptação Segura do Controller:** Tipar o método para retornar `Promise<ProductResponseDto>` delegando a saída a `toProductResponse()`, preservando a chamada `this.productsService.createProduct(dto.name)` intacta.
4. **Análise de Semântica HTTP e Erros:** Validar `201 Created`, `400 Bad Request`, filtragem de propriedades extras (`whitelist: true`) e integridade contra vazamento de stack traces (Artefato 11-04).
5. **Aperfeiçoamento dos Testes de Contrato:** Adicionar teste no `products.controller.spec.ts` simulando propriedade interna (`internalNote`) no retorno do service e verificando sua exclusão via asserção fechada `toEqual()` (Artefato 11-05).
6. **Matriz de Análise de Compatibilidade:** Avaliar 7 cenários hipotéticos de mudança contratual para consumidores (Artefato 11-06).
7. **Validação na API Containerizada:** Reconstruir a imagem Docker `celilac-api:dev` e verificar o contrato HTTP operacional contra o contêiner e o banco PostgreSQL (Artefato 11-07).
8. **Consolidação e Checklist:** Garantir rastreabilidade no GitHub e conformidade com o checklist de qualidade (Artefato 11-08).
