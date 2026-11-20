# ARTEFATO 11-02 — DEFINIÇÃO EXPLÍCITA DO CONTRATO PÚBLICO HTTP

## 1. Contexto e Objetivo do Contrato Público

O objetivo deste artefato é estabelecer formalmente a especificação do contrato público HTTP para o endpoint de cadastro de produtos (`POST /products`) no backend do CeliLac.

A estabilização do contrato tem por premissa fundamental a **separação de modelos**:
- O cliente da API não deve conhecer a estrutura da entidade de domínio ou da tabela do banco de dados.
- O domínio não deve ser moldado para atender exigências específicas de formatação ou protocolos externos.

---

## 2. Diferenciação e Responsabilidade dos Quatro Modelos

No ecossistema do NestJS com arquitetura em camadas e DDD, quatro modelos distintos coexistem e desempenham papéis estritamente separados:

| Modelo | Papel Arquitetural | Localização no Projeto | Modificabilidade |
| :--- | :--- | :--- | :--- |
| **DTO de Entrada (`CreateProductDto`)** | Capturar, validar e sanitizar os dados enviados pelo cliente HTTP no corpo da requisição. | `src/modules/products/dtos/create-product.dto.ts` | Moldado conforme o payload de entrada aceito pela API. |
| **Entidade de Domínio (`Product`)** | Expressar as regras de negócio, invariantes e identidade do conceito no núcleo da aplicação. | `src/modules/products/entities/product.entity.ts` | Agnóstica a protocolos de rede, bancos de dados e serialização. |
| **Entidade de Persistência (`ProductTypeOrmEntity`)** | Mapear o esquema relacional das tabelas, colunas, chaves primárias e tipos específicos do PostgreSQL. | `src/infrastructure/persistence/products/product.orm-entity.ts` | Gerenciada pelo TypeORM e migrations. Totalmente invisível para a camada HTTP. |
| **DTO de Resposta (`ProductResponseDto`)** | Definir o contrato público explícito e estável devolvido aos clientes da API. | `src/modules/products/mappers/product-response.mapper.ts` | Garante estabilidade contratual e impede vazamento de dados internos. |

---

## 3. Especificação do Contrato Público de Saída

Para o endpoint `POST /products`, o contrato público é definido de forma fechada e estrita:

```typescript
export interface ProductResponseDto {
  productId: string;
  name: string;
}
```

### Detalhamento dos Campos do Payload de Resposta

| Campo | Tipo JSON | Obrigatoriedade | Origem dos Dados | Justificativa de Negócio | Impacto para o Consumidor |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `productId` | `string` (UUID v4) | Obrigatório | `product.productId` | Identificador único estável do produto gerado pelo backend. | Utilizado pelo consumidor para futuras consultas, atualizações ou vinculação em listas. |
| `name` | `string` | Obrigatório | `product.name` | Nome comercial atribuído ao produto cadastrado. | Exibido na interface do usuário (UI) e comprovante da operação. |

### Regras do Contrato:
1. **Nenhum Campo Adicional:** Apenas `productId` e `name` são partes integrantes da resposta de sucesso. Quaisquer outras propriedades computadas internamente pelo sistema ou banco (como timestamps, flags de status interno ou metadados de auditoria) não devem ser serializadas.
2. **Formato JSON:** Cabeçalho de resposta `Content-Type: application/json; charset=utf-8`.
3. **Código de Status:** `201 Created` para operações de cadastro com sucesso.

---

## 4. Comparação entre Contrato Anterior e Contrato Estabilizado

| Dimensão | Estado Anterior (Material 10) | Estado Estabilizado (Material 11) | Benefício Arquitetural |
| :--- | :--- | :--- | :--- |
| **Tipo de Retorno do Controller** | `Promise<Product>` (implícito) | `Promise<ProductResponseDto>` | Tipagem explícita e autoverificável em tempo de compilação. |
| **Serialização em Runtime** | Objeto de domínio retornado diretamente | Mapeamento explícito via `toProductResponse()` | Blindagem em tempo de execução contra injeção de campos extras. |
| **Documentação do Contrato** | Deduzida a partir da entidade `Product` | Formalizada em interface dedicada `ProductResponseDto` | Consumo desacoplado por front-ends, apps móveis e parceiros. |
| **Testes de Contrato** | Asserção simples do valor mockado | Asserção fechada com `toEqual` e teste de não exposição | Detecção precoce de quebra de contrato no pipeline CI/CD. |

---

## 5. Decisões Técnicas e Diretrizes de Compatibilidade

1. **Uso de Interface TypeScript para o DTO de Resposta:** `ProductResponseDto` foi estruturado como `interface` por se tratar de um objeto de saída, minimizando sobrecarga de metadados desnecessários em runtime e permitindo importação como tipo (`import type`).
2. **Mapper Explícito em Função Pura:** A transformação é realizada pela função pura `toProductResponse(product: Product): ProductResponseDto`. Funções puras facilitam testes unitários e eliminam efeitos colaterais.
3. **Preservação dos Contratos Internos:** O método `createProduct(name: string): Promise<Product>` da classe `ProductsService` e a entidade `Product` permanecem estritamente intactos, mantendo a integridade do domínio.
