# Artefato 2 — Decomposição em Unidades de Trabalho

## 1. Visão Geral da Decomposição
Para a implementação técnica completa do caso de uso **UC12 — Cadastrar Produto**, as responsabilidades foram decompostas em **6 unidades de trabalho técnicas (Sub-Issues)** independentes, coesas e atribuíveis, respeitando a arquitetura em camadas do projeto (Domínio, Aplicação, Infraestrutura/Persistência e Interface HTTP) e sem fragmentação artificial do ciclo de desenvolvimento.

---

## 2. Tabela de Unidades de Trabalho Técnicas

| ID Provisório | Nome da Atividade Técnica | Componente / Camada | Requisitos de Origem | Dependências | Critério Geral de Conclusão |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **SUB-01** | Modelar a Entidade de Domínio `Product` e Invariantes | Domínio (`modules/products/entities`) | RF01, RF02, RN01, RN02, RN03 | Nenhuma | Entidade criada com atributos fundamentais (id, nome, preço, timestamps), validações de invariantes de negócio e tipagem estrita. |
| **SUB-02** | Implementar DTOs de Entrada e Saída com Validações de Contrato | Aplicação / DTOs (`modules/products/dtos`) | RF02, RF04, RF05, FA01, FA02 | Nenhuma | DTOs `CreateProductDto` e `ProductResponseDto` implementados com regras de validação sintática (ex.: `@IsNotEmpty`, `@IsPositive`, `@Min`) e mensagens de erro padronizadas. |
| **SUB-03** | Configurar Persistência, Schema de Banco e Repositório de Produtos | Persistência / Infraestrutura (`infrastructure/persistence` e `modules/products/repositories`) | RF03, FE01 | SUB-01 | Interface `ProductRepository` definida, migration de criação da tabela de produtos executada com sucesso e repositório integrado ao ORM com tratamento de falhas. |
| **SUB-04** | Implementar o Serviço de Aplicação para Cadastro de Produto | Aplicação / Serviço (`modules/products/services`) | RF01, RF02, RF03, RF04, RN03, RN04 | SUB-01, SUB-02, SUB-03 | Classe `CreateProductService` orquestrando o fluxo de cadastro: validação, instanciação do domínio, persistência via repositório e tratamento de erros de negócio. |
| **SUB-05** | Implementar o Controlador HTTP e Rota `POST /products` | Interface / Apresentação (`modules/products/controllers`) | RF01, RF04, RF05, CA01, CA02, CA03 | SUB-02, SUB-04 | Rota `POST /products` disponibilizada no NestJS, aplicando pipes de validação de payload, retornando status HTTP 201 Created em sucesso e erros 400/422 apropriados, além de documentação OpenAPI/Swagger. |
| **SUB-06** | Implementar Suíte Completa de Testes Automatizados (Unitários e E2E) | Qualidade / Testes (`test/` e arquivos `.spec.ts`) | RF01 a RF05, RN01 a RN04, FA01, FA02, FE01, CA01 a CA04 | SUB-01, SUB-02, SUB-03, SUB-04, SUB-05 | Testes unitários para domínio e serviço de aplicação cobrindo fluxos de sucesso e exceção; testes de integração/E2E cobrindo a rota HTTP com validação de status e persistência no banco. |

---

## 3. Justificativa Técnica da Decomposição
1. **Atendimento ao Critério Mínimo:** Foram definidas 6 unidades de trabalho técnicas legítimas, cada qual correspondendo a uma camada arquitetural concreta e a um objetivo funcional específico.
2. **Separação de Responsabilidades:** A segregação entre Domínio (`SUB-01`), Contratos (`SUB-02`), Persistência (`SUB-03`), Aplicação (`SUB-04`), Exposição HTTP (`SUB-05`) e Testes Automatizados (`SUB-06`) permite desenvolvimento paralelo onde viável e auditoria técnica clara.
3. **Não Fragmentação de TDD:** As unidades de trabalho não foram fatiadas em etapas de desenvolvimento de teste isoladas (como "criar teste vermelho" e "criar código verde"). Cada unidade técnica prevê seu escopo completo e a garantia de qualidade correspondente.

