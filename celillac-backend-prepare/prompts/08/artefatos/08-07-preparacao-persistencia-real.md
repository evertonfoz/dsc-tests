# ARTEFATO 08-07 — PREPARAÇÃO CONCEITUAL PARA PERSISTÊNCIA REAL (POSTGRESQL E TYPEORM)

> [!IMPORTANT]
> **Escopo estritamente conceitual e de planejamento:** Em conformidade com as restrições obrigatórias do Material 08, **nenhuma implementação de PostgreSQL, TypeORM ou migrations foi antecipada para o módulo `products` nesta unidade**. Todo o planejamento abaixo prepara tecnicamente a futura execução da [`SUB-04 — [UC12][Persistência] Configurar persistência e implementar repositório de produtos` (Issue #7)](https://github.com/evertonfoz/dsc-tests/issues/7).

---

## 1. Arquitetura Atual vs. Evolução Conceitual

### 1.1 Arquitetura Atual (Verificada no Material 08)
```text
ProductsController
        │
        ▼
ProductsService
        │
        ▼
ProductsRepository (Token: PRODUCTS_REPOSITORY)
        │
        ▼
InMemoryProductsRepository
```

### 1.2 Evolução Conceitual Planejada (Padrão Ports and Adapters / Inversão de Dependência)
```text
ProductsController
        │
        ▼
ProductsService
        │
        ▼
ProductsRepository (Token: PRODUCTS_REPOSITORY)
        │
        ├──> InMemoryProductsRepository (Alternativa didática / testes rápidos em memória)
        │
        └──> Futuro adaptador PostgreSQL / TypeORM (Alternativa de infraestrutura relacional — SUB-04)
```
- **Nota arquitetural:** As duas implementações (`InMemoryProductsRepository` e o futuro adaptador PostgreSQL/TypeORM) representam **alternativas de infraestrutura** para o mesmo contrato `ProductsRepository`, selecionadas pela configuração do provider no módulo NestJS — não significa que ambas devam operar simultaneamente em uma mesma requisição.

---

## 2. Limitações da Persistência em Memória (`InMemoryProductsRepository`)

A implementação atual (`private readonly products: Product[] = []` em `InMemoryProductsRepository`) cumpriu seu papel didático para validar o fluxo HTTP integrado do backend, mas apresenta **6 limitações estruturais** que impedem seu uso como persistência definitiva em produção:

| # | Limitação | Descrição Técnica e Impacto em Produção |
| :---: | :--- | :--- |
| **1** | **Volatilidade dos dados** | Todos os registros estão alocados na memória RAM do processo Node.js (`this.products`). Qualquer reinicialização, deploy, crash ou encerramento do servidor apaga 100% dos produtos cadastrados. |
| **2** | **Escopo restrito à instância** | O array pertence à instância em memória de `InMemoryProductsRepository`. Se a aplicação escalar horizontalmente (múltiplos processos/containers Node.js), cada réplica enxergará apenas seu próprio array local, gerando inconsistência imediata de estado. |
| **3** | **Concorrência** | Um array em memória não oferece controle de concorrência multi-processo, isolamento de leitura/escrita (*MVCC*) nem bloqueios (*locks*) transacionais. |
| **4** | **Ausência de transações reais (ACID)** | Não há suporte a `BEGIN / COMMIT / ROLLBACK`. Em operações compostas ou falhas parciais (`FE01`), não existe mecanismo transacional nativo de rollback. |
| **5** | **Limitações das restrições de integridade** | O array `push(product)` aceita qualquer objeto em memória sem validar chaves primárias duplicadas (`PRIMARY KEY`), restrições `NOT NULL`, tamanhos de coluna (`VARCHAR`) ou índices únicos no banco de dados. |
| **6** | **Ausência de durabilidade** | Uma vez respondido `201 Created`, não há garantia de gravação em armazenamento secundário não volátil (disco/WAL do SGBD). |

---

## 3. Componentes Preservados vs. Componentes que Evoluirão na `SUB-04`

Graças à inversão de dependência já estabelecida por `ProductsRepository` e `PRODUCTS_REPOSITORY`, a transição para PostgreSQL/TypeORM preservará intacto o núcleo de domínio, aplicação e interface HTTP:

### 3.1 Componentes Integralmente Preservados (Não Sofrem Alteração de Contrato)
1. **`ProductsController` (`src/modules/products/controllers/products.controller.ts`):** Continua recebendo `CreateProductDto` e delegando `this.productsService.createProduct(dto.name)`.
2. **`CreateProductDto` (`src/modules/products/dtos/create-product.dto.ts`):** Continua validando o contrato de entrada HTTP (`name`).
3. **`ProductsService` (`src/modules/products/services/products.service.ts`):** Continua injetando `@Inject(PRODUCTS_REPOSITORY)` e invocando `this.productsRepository.save(product)` sem conhecer TypeORM ou SQL.
4. **Entidade de Domínio `Product` (`src/modules/products/entities/product.entity.ts`):** Permanece pura, sem decoradores de ORM (`@Entity`, `@Column`), preservando `productId: string` e `name: string`.
5. **Interface `ProductsRepository` e Token `PRODUCTS_REPOSITORY` (`src/modules/products/repositories/products.repository.interface.ts`):** Mantêm a assinatura `save(product: Product): Promise<Product>` e o token `'PRODUCTS_REPOSITORY'`.

### 3.2 Componentes que Poderão Evoluir na Futura `SUB-04` (Seguindo o Padrão Já Existente em `src/infrastructure/persistence/orders/`)
A inspeção da arquitetura já existente no repositório para `orders` e `payments` (`src/infrastructure/persistence/orders/` e `src/database/`) mostra exatamente como a `SUB-04` deverá ser estruturada quando for iniciada:

| Componente Futuro (Planejado para a `SUB-04`) | Papel Técnico | Caminho / Padrão Arquitetural no Repositório |
| :--- | :--- | :--- |
| **Entidade de Persistência ORM (`ProductEntity`)** | Mapear a tabela relacional `products` no TypeORM (`@Entity('products')`, `@PrimaryColumn('uuid', { name: 'product_id' })`, `@Column({ name: 'name' })`). | `src/infrastructure/persistence/products/product.orm-entity.ts` *(separada da entidade de domínio `Product`)* |
| **Mapper Domínio ↔ Persistência (`ProductMapper`)** | Converter entre a entidade de domínio `Product(productId, name)` e a entidade ORM `ProductEntity` (`toDomain` / `toPersistence`). | `src/infrastructure/persistence/products/product.mapper.ts` |
| **Adaptador TypeORM (`TypeOrmProductsRepository`)** | Implementar `ProductsRepository` injetando `@InjectRepository(ProductEntity)` e persistindo no PostgreSQL via `Repository<ProductEntity>`. | `src/infrastructure/persistence/products/typeorm-products.repository.ts` |
| **Migration da Tabela `products`** | Criar de forma versionada e reproduzível a tabela `products` no PostgreSQL (`synchronize: false`). | `src/database/migrations/<timestamp>-CreateProductsTable.ts` + registro em `src/database/data-source.ts` |
| **Atualização do Provider em `ProductsModule`** | Importar `TypeOrmModule.forFeature([ProductEntity])` e associar `PRODUCTS_REPOSITORY` ao `TypeOrmProductsRepository` (`useClass` ou `useExisting`). | `src/modules/products/products.module.ts` |
| **Testes de Integração com Banco Real e Tratamento de Falhas (`FE01`)** | Verificar gravação efetiva na tabela `products` do PostgreSQL e o comportamento diante de falhas de persistência (`FE01`). | Suíte de persistência / integração com banco real (`SUB-04` / `SUB-07`). |

---

## 4. Dependências, Riscos e Mitigações para a Futura Persistência Real

| Risco / Dependência | Impacto Potencial | Estratégia de Mitigação Planejada |
| :--- | :--- | :--- |
| **Acoplamento acidental do domínio ao TypeORM** | Poluir a classe `Product` de domínio com decoradores `@Entity()` / `@Column()`. | Manter `Product` puro em `src/modules/products/entities/product.entity.ts` e criar `ProductEntity` separada em `src/infrastructure/persistence/products/`, seguindo o padrão de `Order` vs. `OrderEntity`. |
| **Divergência de schema com `synchronize: false`** | Como `AppModule` e `data-source.ts` utilizam `synchronize: false`, a tabela `products` não é criada automaticamente pelo ORM. | Criar e executar a migration TypeORM (`pnpm typeorm migration:run`) antes dos testes com banco real na `SUB-04`. |
| **Quebra de testes unitários ou integrados em memória** | Substituir o provider sem preservar a capacidade de testar em memória quando o banco não estiver ativo. | Manter `InMemoryProductsRepository` disponível para testes rápidos em memória ou permitir override controlado do token `PRODUCTS_REPOSITORY` conforme o nível de teste. |

---

## 5. Rastreabilidade com o GitHub (`SUB-04` — Issue #7)

- **Issue correspondente:** [`SUB-04 — [UC12][Persistência] Configurar persistência e implementar repositório de produtos` (Issue #7)](https://github.com/evertonfoz/dsc-tests/issues/7).
- **Responsável designado:** Everton Coimbra de Araújo (`@evertonfoz` / papel simulado: Bruno Oliveira Santos).
- **Revisor designado:** Ana Clara Souza (papel simulado / `@evertonfoz`).
- **Status atual no GitHub Project #6:** **`Ready`** (permanece em **`Ready`**, pois a elaboração deste planejamento técnico não inicia nem conclui a implementação da `SUB-04`, e nenhuma branch de persistência foi criada nesta unidade).

