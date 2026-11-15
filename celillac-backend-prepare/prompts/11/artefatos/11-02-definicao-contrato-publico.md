# ARTEFATO 11-02 — DEFINIÇÃO DO CONTRATO PÚBLICO HTTP

## 1. Contrato de Entrada

- **Rota:** `POST /products`
- **DTO de Entrada:** `CreateProductDto` (`src/modules/products/dtos/create-product.dto.ts`)
- **Payload JSON esperado:**
  ```json
  {
    "name": "Produto de exemplo"
  }
  ```
- **Regras de validação (`class-validator` + `ValidationPipe`):**
  - `name`: obrigatório (`@IsNotEmpty()`), tipo `string` (`@IsString()`).
  - `ValidationPipe({ whitelist: true, transform: true })` remove propriedades não decoradas no DTO de entrada.

---

## 2. Contrato de Saída Anterior

Anteriormente, `ProductsController.create()` declarava retorno `Promise<Product>`, expondo diretamente a entidade de domínio `Product`:

```json
{
  "productId": "48a5b986-996f-48f8-a55f-dcbb86317d0c",
  "name": "Produto de exemplo"
}
```

Embora os campos fossem idênticos em execução atual, não havia barreira explícita entre o modelo de domínio e a representação HTTP.

---

## 3. Contrato Público Definido (`ProductResponseDto`)

```typescript
export interface ProductResponseDto {
  productId: string;
  name: string;
}
```

### Detalhamento dos Campos Públicos

| Campo | Tipo JSON / TS | Obrigatoriedade | Origem | Justificativa | Impacto para o Consumidor |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`productId`** | `string` (UUID v4) | Obrigatório | `product.productId` | Identificador único do produto recém-criado para referência futura pelo cliente | Consumidores dependem do nome exato `productId` como `string` |
| **`name`** | `string` | Obrigatório | `product.name` | Confirmação do nome persistido após criação | Consumidores exibem ou validam o nome cadastrado |

Não foram introduzidos campos não confirmados (como `price`, `description`, `partnerId`, `status` ou `internalNote`), nem houve renomeação de `productId`.

---

## 4. Separação de Responsabilidades entre Modelos

| Modelo | Caminho | Responsabilidade |
| :--- | :--- | :--- |
| **`CreateProductDto`** | `src/modules/products/dtos/create-product.dto.ts` | Validar e tipar os dados recebidos na requisição HTTP (`POST /products`) |
| **`Product`** | `src/modules/products/entities/product.entity.ts` | Representar a entidade de domínio e suas invariantes no núcleo da aplicação |
| **`ProductOrmEntity`** | `src/infrastructure/persistence/products/product.orm-entity.ts` | Mapear colunas, tipos SQL e schema (`products.products`) para o TypeORM/PostgreSQL |
| **`ProductResponseDto`** | `src/modules/products/mappers/product-response.mapper.ts` | Definir e estabilizar a representação pública serializada na resposta HTTP |

Mesmo quando compartilham nomes de propriedades (`productId`, `name`), cada modelo evolui por razões distintas (validação de entrada, regra de negócio, esquema relacional e contrato público com consumidores).

---

## 5. Decisões Técnicas e Compatibilidade

- **Decisão:** Não havia DTO de resposta nem mapper HTTP dedicados em `src/modules/products/`. Foi decidida a criação de `src/modules/products/mappers/product-response.mapper.ts` exportando `ProductResponseDto` e `toProductResponse(product)`.
- **Compatibilidade:** A resposta JSON pública permanece 100% compatível (`productId` e `name` com status `201 Created`), eliminando qualquer quebra para consumidores existentes enquanto protege a fronteira HTTP contra evoluções futuras do domínio ou da persistência.
- **Pendências:** Nenhuma pendência estrutural quanto à definição dos campos públicos.

