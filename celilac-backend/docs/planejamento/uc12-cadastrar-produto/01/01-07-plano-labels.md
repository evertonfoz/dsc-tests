# Artefato 7 — Plano de Labels

## 1. Visão Geral
Este artefato define o esquema taxonômico de labels padronizadas a ser criado e utilizado no repositório do GitHub. O esquema garante categorização semântica por funcionalidade, tipo de trabalho, camada arquitetural e nível de prioridade.

---

## 2. Categorias de Labels

### 2.1 Labels de Domínio / Módulo Funcional
- `module:products`: Identifica todas as Issues e Sub-Issues ligadas ao módulo de gerenciamento de produtos.

### 2.2 Labels de Tipo de Atividade
- `type:epic`: Identifica issues de nível macro (Casos de Uso completos).
- `type:feature`: Desenvolvimento de novas capacidades e componentes de software.
- `type:test`: Implementação de testes unitários, testes de integração e testes E2E.
- `type:documentation`: Tarefas voltadas à especificação de APIs, OpenAPI/Swagger e documentação de arquitetura.

### 2.3 Labels de Camada Arquitetural
- `layer:domain`: Camada de domínio (entidades, regras intrínsecas e interfaces de repositório).
- `layer:application`: Camada de aplicação (serviços de orquestração, DTOs e validações).
- `layer:infrastructure`: Camada de infraestrutura e persistência (ORM, migrations, banco de dados).
- `layer:api`: Camada de exposição e transporte HTTP (controllers, rotas, pipes e filtros).

### 2.4 Labels de Prioridade
- `priority:critical`: Bloqueio essencial no caminho crítico.
- `priority:high`: Tarefas de alto impacto no escopo funcional principal.
- `priority:medium`: Tarefas de apoio, testes complementares ou exposição acessória.

---

## 3. Tabela de Mapeamento de Labels

| Nome da Label | Cor Sugerida (Hex) | Finalidade / Descrição | Issues / Sub-Issues Onde Será Aplicada |
| :--- | :---: | :--- | :--- |
| `module:products` | `#0E8A16` (Verde escuro) | Associa o artefato ao módulo de Produtos do CeliLac | Issue Principal (Épico) e todas as Sub-Issues (`SUB-01` a `SUB-06`) |
| `type:epic` | `#3E2723` (Marrom escuro) | Define que a issue agrupa um caso de uso macro | Issue Principal `[UC12] Cadastrar Produto` |
| `type:feature` | `#1D76DB` (Azul clássico) | Identifica nova implementação funcional | `SUB-01`, `SUB-02`, `SUB-03`, `SUB-04`, `SUB-05` |
| `type:test` | `#FBCA04` (Amarelo) | Implementação ou ampliação de testes automatizados | `SUB-06` |
| `layer:domain` | `#5319E7` (Roxo) | Componentes de regras de negócio e entidades de domínio | `SUB-01` |
| `layer:application` | `#0052CC` (Azul royal) | Serviços de aplicação e DTOs de transporte interno | `SUB-02`, `SUB-04` |
| `layer:infrastructure` | `#D93F0B` (Laranja) | Acesso a dados, migrações SQL e repositórios ORM | `SUB-03` |
| `layer:api` | `#1D76DB` (Ciano/Azul) | Controladores REST, rotas HTTP e documentação Swagger | `SUB-05` |
| `priority:high` | `#B60205` (Vermelho) | Atividades de alta prioridade estrutural | `SUB-01`, `SUB-02`, `SUB-03`, `SUB-04` |
| `priority:medium` | `#E99695` (Vermelho claro) | Atividades complementares de transporte e validação final | `SUB-05`, `SUB-06` |

---

## 4. Instrução de Aplicação
Ao registrar as issues no GitHub, aplique rigorosamente as combinações definidas acima. Isso possibilitará a filtragem dinâmica no Board Kanban e nas listagens de issues do repositório por módulo, camada ou nível de urgência.

