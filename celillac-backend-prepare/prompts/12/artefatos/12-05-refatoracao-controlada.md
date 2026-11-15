# ARTEFATO 12-05 — REFATORAÇÃO CONTROLADA / REGISTRO DE PRESERVAÇÃO ARQUITETURAL

## 1. Natureza Condicional da Intervenção Prática 4

No Material 12, a **Intervenção Prática 4 (Refatoração Controlada)** possui caráter estritamente condicional: mudanças no código-fonte só devem ser executadas quando a auditoria comprovar um problema técnico real e uma melhoria tecnicamente justificada.

Como as Fases 4 (`12-03`) e 5 (`12-04`) demonstraram que a arquitetura atual do fluxo `UC12 — Cadastrar Produto` já atende integralmente aos critérios de separação de responsabilidades, baixo acoplamento, inversão de dependências e estabilidade de contratos, **a decisão fundamentada desta etapa é preservar o código existente sem realizar refatorações artificiais**.

---

## 2. Verificação Específica sobre o Exemplo do Material Didático (`toProductResponse`)

O Material 12 apresenta um exemplo ilustrativo no qual o `ProductsController` construiria manualmente o objeto literal de resposta:

```typescript
// Exemplo hipotético de mapeamento inline apresentado no PDF:
return {
  productId: product.productId,
  name: product.name,
};
```

E propõe sua substituição pela chamada ao mapper HTTP:

```typescript
return toProductResponse(product);
```

### Evidência no Código Real do CeliLac
A inspeção direta de `src/modules/products/controllers/products.controller.ts` (linhas 13–18) e `src/modules/products/mappers/product-response.mapper.ts` (linhas 1–13) comprova que **essa melhoria já foi implementada e consolidada no Material 11** (commit `e4e3e12`):

```typescript
// src/modules/products/controllers/products.controller.ts (código atual)
@Post()
async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
  const product = await this.productsService.createProduct(dto.name);

  return toProductResponse(product);
}
```

Portanto:
- `ProductResponseDto` e `toProductResponse()` **não** foram recriados.
- Nenhuma duplicação de mapeamento HTTP foi encontrada.
- O código do `ProductsController` e de `product-response.mapper.ts` foi integralmente preservado.

---

## 3. Registro Formal de Preservação Arquitetural

### 3.1. Componentes Examinados e Preservados

| Arquivo Examinado | Papel Arquitetural | Status na Fase 6 |
| :--- | :--- | :--- |
| `src/modules/products/entities/product.entity.ts` | Entidade de domínio `Product` | **Preservado sem alterações** |
| `src/modules/products/dtos/create-product.dto.ts` | DTO de entrada HTTP `CreateProductDto` | **Preservado sem alterações** |
| `src/modules/products/mappers/product-response.mapper.ts` | Contrato público `ProductResponseDto` e mapper `toProductResponse()` | **Preservado sem alterações** |
| `src/modules/products/controllers/products.controller.ts` | Fronteira HTTP `ProductsController` (`POST /products`) | **Preservado sem alterações** |
| `src/modules/products/services/products.service.ts` | Caso de uso `ProductsService.createProduct(name)` | **Preservado sem alterações** |
| `src/modules/products/repositories/products.repository.interface.ts` | Contrato `ProductsRepository` e token `PRODUCTS_REPOSITORY` | **Preservado sem alterações** |
| `src/modules/products/repositories/in-memory-products.repository.ts` | Repositório em memória para testes integrados | **Preservado sem alterações** |
| `src/infrastructure/persistence/products/typeorm-products.repository.ts` | Adaptador `TypeOrmProductsRepository` | **Preservado sem alterações** |
| `src/infrastructure/persistence/products/product.mapper.ts` | Mapper de persistência `ProductMapper` (`toPersistence` / `toDomain`) | **Preservado sem alterações** |
| `src/infrastructure/persistence/products/product.orm-entity.ts` | Entidade relacional `ProductOrmEntity` (`products.products`) | **Preservado sem alterações** |
| `src/modules/products/products.module.ts` | Composição de providers do módulo `ProductsModule` | **Preservado sem alterações** |

### 3.2. Critérios e Evidências que Sustentam a Preservação

1. **Desacoplamento entre camadas:** `ProductsService` depende unicamente de `Product` e `ProductsRepository` (`PRODUCTS_REPOSITORY`), sem qualquer importação de TypeORM ou de objetos HTTP.
2. **Proteção da fronteira pública:** `ProductsController` utiliza `CreateProductDto` na entrada e `toProductResponse(product): ProductResponseDto` na saída, impedindo a exposição acidental de propriedades internas da entidade.
3. **Isolamento da infraestrutura:** `TypeOrmProductsRepository` encapsula o `Repository<ProductOrmEntity>` do TypeORM e utiliza `ProductMapper` para converter entre `Product` e `ProductOrmEntity`.
4. **Composição explícita:** `ProductsModule` registra `TypeOrmModule.forFeature([ProductOrmEntity])` e vincula `{ provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository }`.
5. **Ausência de diffs artificiais:** `git diff` sobre `src/` e `test/` permanece vazio (`0 files changed`), garantindo que nenhum commit artificial foi criado.

---

## 4. Contratos Obrigatoriamente Preservados

Todos os contratos internos e públicos exigidos pelo projeto foram verificados e mantidos intactos:

| Contrato | Assinatura / Formato Preservado | Verificação |
| :--- | :--- | :--- |
| **Entidade `Product`** | `constructor(public readonly productId: string, public readonly name: string)` | Sem adição de `price`, `description`, `status` ou troca por `id` |
| **Serviço `ProductsService`** | `createProduct(name: string): Promise<Product>` | Preservado (não substituído por `create(dto)`) |
| **Repositório `ProductsRepository`** | `save(product: Product): Promise<Product>` (token `PRODUCTS_REPOSITORY`) | Preservado (sem exposição de tipos do TypeORM) |
| **Mapper HTTP** | `toProductResponse(product: Product): ProductResponseDto` | Preservado e separado de `ProductMapper` |
| **Contrato Público HTTP** | `POST /products` → `201 Created` com `{"productId": "UUID_GERADO", "name": "Produto de exemplo"}` | Preservado e validado por testes automatizados |

---

## 5. Riscos Residuais e Limitações Reconhecidas

1. **Evolução futura das regras de domínio:** Atualmente, a validação de `name` não vazio ocorre na camada HTTP via `CreateProductDto` + `ValidationPipe`. Se `ProductsService.createProduct(name)` passar a ser invocado por outros adaptadores de entrada (ex.: filas de mensagens, CLI ou chamadas diretas entre módulos), será oportuno avaliar invariantes no construtor de `Product` em uma Issue futura com requisitos confirmados.
2. **Isolamento do banco em testes E2E legados (`OBS-04`):** O script `pnpm test:e2e` inicializa `AppModule` apontando para `celilac_db`. Embora `confirm-order.e2e-spec.ts` limpe os registros criados em `afterAll` e não toque na tabela `products.products`, recomenda-se em atividades futuras do módulo `Orders` parametrizar o banco de testes para E2E.
3. **Avisos informativos de linter em testes (`OBS-01`):** Os 3 avisos `unbound-method` / `no-unused-vars` emitidos por `oxlint --type-aware` em arquivos `.spec.ts` não causam falha (`0 errors`) e permanecem inalterados para preservar a fidelidade do histórico de commits dos Materiais 04 a 11.
