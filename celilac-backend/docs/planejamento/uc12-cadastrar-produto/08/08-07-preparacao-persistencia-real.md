# ARTEFATO 08-07 — PREPARAÇÃO CONCEITUAL PARA PERSISTÊNCIA REAL COM POSTGRESQL E TYPEORM

> **Material 08 — Verificação Integrada do Backend e Preparação para Persistência Real**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 07

---

## 1. Contexto e Delimitação Estrita de Escopo

> ⛔ **REGRA CAPITAL METODOLÓGICA:**  
> Esta etapa é **exclusivamente de planejamento arquitetural e modelagem conceitual**. Em estrito respeito à governança do projeto, **nenhuma implementação de banco de dados real, conexão PostgreSQL, migração TypeORM ou container Docker de banco foi antecipada nesta unidade**. A implementação física da persistência real é o escopo estrito do **Material 09**.

---

## 2. Arquitetura Atual vs. Evolução Conceitual Planejada

Graças à aplicação rigorosa do **Princípio da Inversão de Dependência (DIP)** e da separação em camadas mantida desde o Material 04, a evolução para persistência real em banco relacional ocorrerá sem alterar uma única linha das camadas de Apresentação (Controller/DTO), Aplicação (Service) ou Domínio (Entidade).

### 2.1 Arquitetura Atual (Verificada no Material 08)
```text
ProductsController (HTTP)
        │
        ▼
ProductsService (Aplicação)
        │
        ▼
ProductsRepository (Contrato / Interface)  ◄─── Token: PRODUCTS_REPOSITORY
        │
        ▼
InMemoryProductsRepository (Infraestrutura em Memória)
  [ private readonly products: Product[] ]
```

### 2.2 Evolução Conceitual Planejada (Próximas Etapas — Material 09)
```text
ProductsController (HTTP)  [INALTERADO]
        │
        ▼
ProductsService (Aplicação)  [INALTERADO]
        │
        ▼
ProductsRepository (Contrato / Interface)  [INALTERADO]  ◄─── Token: PRODUCTS_REPOSITORY
        │
        ├─────────────────────────────────────────┐
        ▼                                         ▼
InMemoryProductsRepository             TypeOrmProductsRepository (Adaptador Novo)
(Ambiente de testes rápidos e unitários)          │
                                                  ▼
                                       TypeORM Repository / EntityManager
                                                  │
                                                  ▼
                                       Tabela 'products' (PostgreSQL)
```

*(Nota técnica: `InMemoryProductsRepository` e `TypeOrmProductsRepository` constituem adaptadores alternativos que satisfazem o mesmo contrato `ProductsRepository`. Eles não operam simultaneamente na mesma requisição de produção, mas são intercambiáveis através do container de injeção de dependência).*

---

## 3. Análise de Impacto na Arquitetura do Projeto

### 3.1 Componentes que Serão Integralmente Preservados:
1. **`ProductsController`:** Permanece inalterado. Não sabe e não precisa saber se os dados são gravados em memória, PostgreSQL, MongoDB ou arquivo.
2. **`CreateProductDto`:** Permanece inalterado. As regras de validação sintática na borda continuam idênticas.
3. **`ProductsService`:** Permanece inalterado. Continua orquestrando a criação da entidade e invocando `this.productsRepository.save(product)`.
4. **`Product` (Entidade de Domínio):** Permanece inalterada. Representa a verdade do negócio e suas invariantes, livre de anotações ou dependências de bibliotecas de terceiros (sem decorators de ORM no domínio puro).
5. **`ProductsRepository` (Interface) e `PRODUCTS_REPOSITORY` (Token):** Permanecem inalterados. O contrato `save(product: Product): Promise<Product>` continua sendo a fronteira respeitada.

### 3.2 Novos Componentes e Infraestrutura que Evoluirão na Camada de Infraestrutura:
1. **Entidade de Persistência / ORM Entity (`ProductOrmEntity`):**
   - Classe dedicada da camada de infraestrutura contendo anotações `@Entity('products')`, `@PrimaryColumn()`, `@Column()`.
2. **Mapper Bidirecional (`ProductOrmMapper`):**
   - Tradutor estático puro para converter `Product` (Domínio) ➔ `ProductOrmEntity` (Persistência) e vice-versa, impedindo acoplamento entre o domínio e o banco relacional.
3. **Adaptador Concreto de Persistência (`TypeOrmProductsRepository`):**
   - Implementação de `ProductsRepository` que injeta o repositório TypeORM e persiste registros no PostgreSQL real.
4. **Data Source e Migrações (`src/database/migrations/`):**
   - Scripts versionados SQL/TypeScript para criação e versionamento da tabela `products` no banco de dados.
5. **Reconfiguração do Módulo (`ProductsModule`):**
   - No ambiente de produção/integração real, o provider customizado associará o token `PRODUCTS_REPOSITORY` à nova classe `TypeOrmProductsRepository`.

---

## 4. Análise Crítica das 6 Limitações Técnicas da Persistência em Memória

A persistência baseada em `InMemoryProductsRepository` (`private readonly products: Product[] = []`) cumpre com perfeição seu papel didático e de viabilização ágil de testes iniciais, mas possui limitações intransponíveis para operação real:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. VOLATILIDADE DOS DADOS                                              │
│    - Todo o estado reside na memória RAM alocada pelo processo Node.js.│
│    - Reinício do processo, deploy, crash ou reinicialização do sistema │
│      provocam perda instantânea e irrecuperável de todos os registros. │
├────────────────────────────────────────────────────────────────────────┤
│ 2. ESCOPO RESTRITO À INSTÂNCIA LOCAL                                   │
│    - A coleção de produtos pertence exclusivamente ao processo local.   │
│    - Em arquitetura em nuvem escalada horizontalmente (múltiplos pods  │
│      ou réplicas), cada instância possui seu array isolado, quebrando  │
│      completamente a consistência dos dados entre requisições.         │
├────────────────────────────────────────────────────────────────────────┤
│ 3. CONCORRÊNCIA E AUSÊNCIA DE LOCKS                                    │
│    - Operações concorrentes em Node.js no event loop podem sofrer      │
│      intercalações assíncronas com condições de corrida (Race Conditions│
│    - Inexistência de locks pessimistas ou otimistas de banco de dados. │
├────────────────────────────────────────────────────────────────────────┤
│ 4. AUSÊNCIA DE TRANSAÇÕES ACID REAIS                                   │
│    - Impossibilidade de realizar transações atômicas compostas.        │
│    - Se um caso de uso envolver gravar um produto e decrementar saldo  │
│      de estoque, falhas parciais não contam com rollback transacional. │
├────────────────────────────────────────────────────────────────────────┤
│ 5. AUSÊNCIA DE CONSTRAINTS RELACIONAIS NATIVAS DO SGBD                 │
│    - SGBDs relacionais fornecem garantias formais de PRIMARY KEY,      │
│      UNIQUE (ex.: impedir nomes duplicados), NOT NULL, CHECK e FK.     │
│    - O repositório em memória exige checagens manuais imperativas.     │
├────────────────────────────────────────────────────────────────────────┤
│ 6. DURABILIDADE, AUDITORIA E RECUPERAÇÃO DE DESASTRES                  │
│    - Ausência de Write-Ahead Logging (WAL), backups consistentes,      │
│      replicação primário-secundário e auditoria durável.               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Rastreabilidade com a Sub-Issue de Persistência (`SUB-04`)

- **Sub-Issue:** `SUB-04 — [UC12][Persistência] Implementar repositório e persistência para produto` (GitHub Issue [#7](https://github.com/evertonfoz/dsc-tests/issues/7)).
- **Estado de Governança no GitHub Project:** **`Ready` / `Backlog`** (Permanece não iniciada e não concluída).
- **Ressalva Metodológica:** A elaboração deste planejamento técnico **não autoriza** mover a Sub-Issue `SUB-04` para `In Progress` ou `Done`. A Sub-Issue será executada no momento oportuno, em branch dedicada (`feature/uc12-04-products-persistence`), com TDD e migrações reais.

---

## 6. Planejamento de Riscos e Próximas Ações

1. **Risco Mapeado 1: Conexão e variáveis de ambiente:**
   - Mitigação: Configurar TypeORM via `ConfigService` lendo variáveis `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` a partir de `.env`.
2. **Risco Mapeado 2: Falha de isolamento nos testes com banco real:**
   - Mitigação: Utilizar containers descartáveis (via Testcontainers ou compose local) e estratégia de limpeza de tabelas entre execuções de testes.
3. **Próxima Ação Imediata:**
   - Finalizar a consolidação do Material 08, registrar o checklist e submeter o relatório da etapa para revisão da equipe.
