# Artefato 5 — Matriz de Rastreabilidade

## 1. Visão Geral
A matriz de rastreabilidade estabelece o vínculo bidirecional entre os requisitos, fluxos e regras especificados no **UC12 — Cadastrar Produto** e as unidades técnicas de trabalho planejadas no GitHub, assegurando cobertura total sem lacunas nem tarefas órfãs.

---

## 2. Matriz de Rastreabilidade Requisitos x Atividades

| Item de Origem | Tipo de Item | Sub-Issue Vinculada | Atividade Técnica Associada | Critério de Aceite Vinculado | Comportamento a ser Verificado Futuramente |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **RF01** | Requisito Funcional | `SUB-01`, `SUB-04`, `SUB-05` | Modelagem, serviço de aplicação e endpoint HTTP | CA01 | Capacidade do sistema em receber, processar e cadastrar um novo produto. |
| **RF02** | Requisito Funcional | `SUB-01`, `SUB-02`, `SUB-04` | Invariantes de entidade, validações de DTO e validações no serviço | CA01, CA02, CA03 | Verificação de conformidade de nome, preço e tipos antes de qualquer ação. |
| **RF03** | Requisito Funcional | `SUB-03`, `SUB-04` | Criação de schema, migration, repositório TypeORM e chamada no serviço | CA01 | Persistência física dos dados em tabela `products` no PostgreSQL. |
| **RF04** | Requisito Funcional | `SUB-02`, `SUB-04`, `SUB-05` | Pipes de validação, rejeição no serviço e resposta HTTP 400 | CA02, CA03 | Rejeição imediata de cargas inválidas impedindo escrita em banco. |
| **RF05** | Requisito Funcional | `SUB-02`, `SUB-05` | Definição de `ProductResponseDto` e serialização no controller | CA01, CA02 | Retorno de status 201 com dados criados ou status 400 com lista de erros. |
| **RN01** | Regra de Negócio | `SUB-01`, `SUB-02`, `SUB-04` | Invariante na entidade, decorator `@IsNotEmpty` e verificação no serviço | CA02 | Rejeição de produtos cujo nome seja ausente, nulo ou vazio. |
| **RN02** | Regra de Negócio | `SUB-01`, `SUB-02`, `SUB-04` | Invariante na entidade, decorators `@IsPositive` / `@Min` e verificação no serviço | CA03 | Rejeição de produtos com preço menor ou igual a zero ou formato inválido. |
| **RN03** | Regra de Negócio | `SUB-01`, `SUB-03`, `SUB-04` | Garantia de não chamada do repositório em falhas de validação | CA02, CA03 | Auditoria no banco confirmando ausência de registros após requisição rejeitada. |
| **RN04** | Regra de Negócio | `SUB-03`, `SUB-04` | Execução sequencial: validação prévia obrigatória antes do comando `save` | CA01 | Persistência efetiva disparada estritamente após aprovação de todas as validações. |
| **Fluxo Principal** | Fluxo de Caso de Uso | `SUB-01`, `SUB-02`, `SUB-03`, `SUB-04`, `SUB-05` | Cadeia completa de camadas da API | CA01 | Execução do caminho feliz: entrada HTTP -> DTO -> Domínio -> Repositório -> Banco -> Resposta 201. |
| **FA01** | Fluxo Alternativo | `SUB-02`, `SUB-05`, `SUB-06` | Validação de campo nome ausente e testes de asserção | CA02 | Requisição sem nome interrompida no pipe com código HTTP 400. |
| **FA02** | Fluxo Alternativo | `SUB-02`, `SUB-05`, `SUB-06` | Validação de preço incoerente e testes de asserção | CA03 | Requisição com preço negativo/zero interrompida com código HTTP 400. |
| **FE01** | Fluxo de Exceção | `SUB-03`, `SUB-04`, `SUB-06` | Tratamento de falhas de conexão/banco e testes com mock de erro | CA04 | Falha na base capturada com segurança, retornando HTTP 500 sem corromper estado. |
| **CA01 a CA04** | Critérios de Aceite | `SUB-06` | Bateria de testes unitários e de integração E2E | CA01, CA02, CA03, CA04 | Execução automatizada e contínua no Vitest cobrindo 100% dos critérios. |

---

## 3. Análise de Cobertura e Conformidade
- **Regras sem cobertura identificadas:** Nenhuma. Todos os 5 requisitos funcionais (RF01–RF05), as 4 regras de negócio (RN01–RN04), os fluxos (Principal, FA01, FA02, FE01) e os critérios de aceite (CA01–CA04) possuem vínculo com pelo menos uma Sub-Issue técnica.
- **Atividades sem justificativa na especificação:** Nenhuma. Todas as 6 Sub-Issues derivam diretamente de necessidades arquiteturais para viabilizar as regras e fluxos do UC12 no backend NestJS.

