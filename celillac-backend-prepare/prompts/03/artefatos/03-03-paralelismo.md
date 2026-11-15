# ARTEFATO 03 — ANÁLISE DE PARALELISMO

> **Aviso de Rastreabilidade e Governança:**
> - **Caso de Uso:** `UC12 — Cadastrar Produto` (Backend CeliLac).
> - **Objetivo:** Mapear grupos de atividades que podem progredir simultaneamente sem provocar conflitos de código (*merge conflicts*), retrabalho ou dependências circulares, otimizando o fluxo de trabalho da equipe.
> - **Natureza dos Dados:** Atribuição aos integrantes simulados (`Ana Clara`, `Bruno`, `Carla` e `Diego`) mantida para validação do modelo operacional.

---

## 3.1 Tabela de Análise de Paralelismo

| Grupo de Atividades | Issues Envolvidas | Condições Necessárias para Início Simultâneo | Responsáveis Designados | Possibilidade de Execução Simultânea | Riscos Associados ao Paralelismo | Necessidade de Coordenação | Ponto Posterior de Integração |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Grupo 1: Modelagem e Contratos Iniciais** | `SUB-01` (Entidade `Product`) e `SUB-02` (DTOs Entrada/Saída) | Formalização e aprovação documental dos atributos do produto no UC12 pelo PO/equipe. | `Ana Clara` (`SUB-01`) e `Carla` (`SUB-02`) | **Paralelismo Viável** | Divergência de nomes de campos e tipos entre entidade de domínio e DTO de transporte (ex.: `price` em centavos vs. float, nomes de enums). | **Alta:** Alinhar em reunião de 15 min a nomenclatura exata e os tipos primitivos compartilhados antes de codificar. | A entidade e o DTO convergem na camada de aplicação (`SUB-05`). |
| **Grupo 2: Regras de Validação e Persistência de Dados** | `SUB-03` (Validações/Regras) e `SUB-04` (Repositório TypeORM) | `SUB-01` concluída (definição da entidade) e regras `RN01` a `RN04` formalizadas. | `Bruno` (ambas as tarefas) | **Paralelismo Não Recomendado no Momento** *(Sequenciamento Interno)* | Sobrecarga do mesmo integrante e dispersão de contexto, já que Bruno é o executor de ambas as tarefas. | **Média:** Bruno deve priorizar `SUB-04` ou `SUB-03` sequencialmente para manter foco e respeitar o limite de WIP individual. | Ambas convergem como dependências do Serviço de Aplicação (`SUB-05`). |
| **Grupo 3: Infraestrutura, Regras e Esqueleto HTTP** | `SUB-04` (Repositório TypeORM), `SUB-03` (Validações) e `SUB-06` (Controller HTTP) | Contratos de `SUB-01` e `SUB-02` estabilizados; interface `IProductRepository` definida. | `Bruno` (`SUB-03`/`SUB-04`) e `Carla` (`SUB-06`) | **Paralelismo Condicionado** | `Carla` codificar o Controller assumindo assinaturas do serviço que ainda não foram fechadas; `Bruno` alterar estruturas de persistência que impactem o domínio. | **Alta:** Carla deve focar estritamente nas rotas HTTP, decorators do `ValidationPipe` e mapeamento de status codes, sem acoplar diretamente à lógica interna do banco. | Injeção no `ProductsModule` com o `ProductService` (`SUB-05`). |
| **Grupo 4: Orquestração de Aplicação e Testes Unitários** | `SUB-05` (Serviço de Aplicação) e `SUB-07` (Testes Automatizados - Parte Unitária) | Contratos de DTO (`SUB-02`), interface de repositório (`SUB-04`) e funções de validação (`SUB-03`) disponíveis. | `Ana Clara` (`SUB-05`) e `Diego` (`SUB-07`) | **Paralelismo Viável** *(Prática de TDD / Pair Testing)* | Divergência quanto aos comportamentos de erro esperados (ex.: se o service lança exceção de domínio ou retorna `Result<T>`). | **Alta:** Acordar previamente as exceções customizadas (`ProductAlreadyExistsException`, `InvalidProductDataException`). | Execução da suíte de testes unitários do Vitest contra o `ProductService` e suites de validação. |
| **Grupo 5: Verificação E2E e Documentação Técnica** | `SUB-07` (Testes E2E com Supertest) e `SUB-08` (Documentação Swagger/README) | Endpoint `POST /products` (`SUB-06`) e `ProductsModule` integrados e compilando. | `Diego` (ambas as tarefas, com apoio de Carla em `SUB-08`) | **Paralelismo Condicionado** | Documentação ficar desatualizada caso testes E2E apontem necessidade de ajustes nas respostas ou status codes da rota. | **Média:** Diego pode gerar os schemas do Swagger em conjunto com os testes E2E, garantindo que o que foi documentado é exatamente o verificado. | Fechamento da Issue principal (`EPIC-UC12`) para transição a `Done`. |

---

## 3.2 Justificativas Técnicas das Classificações

### 1. Paralelismo Viável (Grupos 1 e 4)
- **Grupo 1 (`SUB-01` e `SUB-02`):** Representam contratos em camadas distintas (Domínio vs. Apresentação). A entidade de domínio não precisa conhecer o DTO HTTP e vice-versa. Bastando que ambas compartilhem a mesma especificação de atributos de negócio (nomes e tipos semânticos), Ana Clara e Carla podem trabalhar em branches isoladas sem conflitos de merge.
- **Grupo 4 (`SUB-05` e `SUB-07` Unitário):** Com base nas interfaces de contrato (`IProductRepository`, DTOs e Exceções de Domínio), Diego pode escrever os testes unitários com mocks no Vitest simultaneamente à escrita da lógica de orquestração por Ana Clara, viabilizando uma dinâmica próxima ao TDD.

### 2. Paralelismo Condicionado (Grupos 3 e 5)
- **Grupo 3 (`SUB-04`/`SUB-03` e `SUB-06`):** Carla pode estruturar o endpoint `POST /products` e validar a entrada HTTP via decorators do NestJS enquanto Bruno configura o TypeORM e as regras de negócio. A condição obrigatória é que Carla não tente invocar o banco diretamente ou implementar a regra de negócio dentro do Controller.
- **Grupo 5 (`SUB-07` E2E e `SUB-08`):** Ambos atuam na camada externa da aplicação. A condição é que as rotas e códigos HTTP estejam estáveis; caso contrário, qualquer alteração em tempo de teste invalidará a documentação do Swagger.

### 3. Paralelismo Não Recomendado no Momento (Grupo 2)
- **Grupo 2 (`SUB-03` e `SUB-04`):** Embora tecnicamente viável do ponto de vista de código (um é validação e o outro é infraestrutura de banco), **ambas as tarefas estão atribuídas ao mesmo integrante (`Bruno`)**. Abrir duas tarefas simultâneas para o mesmo desenvolvedor violaria as boas práticas de fluxo enxuto (*Lean/Kanban*), aumentando a troca de contexto (*context switching*) e mascarando o progresso real.

---

## 3.3 Estratégia de Integração para os Grupos Paralelizáveis

Para assegurar que o paralelismo não resulte em "inferno de integração" (*integration hell*), estabelecem-se as seguintes diretrizes:

### 1. Contratos que Precisam Estar Previamente Definidos
- **Dicionário de Atributos do Produto:** Tabela formal com o nome de cada campo (`name`, `description`, `price`, `category`, `isActive`, etc.), tipos primitivos no TypeScript, opcionalidade e restrições (ex.: tamanho mínimo/máximo de string, precisão monetária em centavos `integer` ou `numeric`).
- **Interface do Repositório (`IProductRepository`):**
  ```typescript
  export interface IProductRepository {
    save(product: Product): Promise<Product>;
    findByName(name: string): Promise<Product | null>;
  }
  ```
- **Contrato de Exceções de Domínio/Aplicação:** Padrão das classes de erro (ex.: `ProductValidationException`, `ProductAlreadyExistsException`) para permitir que o Controller (`SUB-06`) as capture e converta nos códigos HTTP adequados (`400`, `422`, `409`).

### 2. Decisões que Precisam Ser Compartilhadas
- **Camada de Validação Sintática vs. Semântica:** A validação estrutural do payload HTTP (tipos, presença de campos obrigatórios) fica a cargo do `class-validator` nos DTOs (`SUB-02`). As validações de integridade e regras de negócio (`RN01` a `RN04`) residem em classes/métodos de domínio ou serviços puros (`SUB-03`).
- **Padrão de Retorno do Controller:** Definição se a resposta HTTP de sucesso retorna status `201 Created` acompanhado do cabeçalho `Location` ou apenas o corpo com o `ProductResponseDto`.

### 3. Momento de Integração dos Componentes
- **Momento 1 (Integração de Domínio e Contratos):** Ao finalizar `SUB-01` e `SUB-02`, realiza-se uma revisão rápida entre Ana Clara e Carla para confirmar o alinhamento de campos.
- **Momento 2 (Integração de Aplicação):** Ao finalizar `SUB-03` e os contratos de `SUB-04`, Ana Clara integra os componentes no `ProductService` (`SUB-05`) e executa a suíte de testes unitários criada por Diego (`SUB-07`).
- **Momento 3 (Integração de Sistema / Módulo):** Conexão do `ProductController` (`SUB-06`) com o `ProductService` (`SUB-05`) e o `TypeOrmProductRepository` (`SUB-04`) no `ProductsModule`.

### 4. Comportamentos que Deverão Ser Verificados Futuramente
- **Fluxo Principal (Caminho Feliz):** Requisição válida resulta em persistência com sucesso no PostgreSQL, retorno `201 Created` e payload contendo ID gerado (`CA01`).
- **Fluxos Alternativos de Validação:** Requisição com dados inválidos conforme `RN01` e `RN02` retorna `400` ou `422`, detalhando os campos faltantes ou incorretos (`CA02`).
- **Garantia de Não Persistência de Inválidos:** Nenhuma linha de produto com dados inválidos é gravada no banco de dados (`CA03`).
- **Tratamento de Falha de Persistência:** Falha de conexão ou restrição de banco (`FE01`) é interceptada e convertida em resposta amigável sem expor detalhes internos do PostgreSQL (`CA04`).

