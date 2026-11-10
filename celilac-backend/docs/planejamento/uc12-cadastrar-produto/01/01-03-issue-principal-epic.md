# Artefato 3 — Issue Principal (Epic)

> **Instruções de Uso:** O conteúdo abaixo foi estruturado em formato Markdown pronto para cópia e colagem direta na criação da Issue principal no GitHub.

```markdown
# [UC12] Cadastrar Produto

## 1. Objetivo Geral
Implementar a funcionalidade completa de cadastro de produtos no sistema CeliLac, garantindo a recepção segura dos dados, validação rigorosa de regras de negócio, integridade da persistência e retorno padronizado para os clientes da API.

---

## 2. Contexto e Escopo
O módulo de **Gerenciamento de Produtos** necessita de um ponto de entrada seguro e confiável para registrar novos itens no catálogo. O fluxo contempla desde a submissão dos dados pelo cliente até a persistência em banco de dados relacional, garantindo que produtos inválidos ou incompletos jamais sejam registrados na base.

- **Sistema:** CeliLac
- **Módulo:** Gerenciamento de Produtos
- **Referência Formal:** Documento de Especificação de Caso de Uso — UC12 (Cadastrar Produto)

---

## 3. Requisitos Funcionais Contemplados
- [x] **RF01 — Cadastro de produto:** Disponibilizar operação para cadastrar produtos conforme o UC12.
- [x] **RF02 — Validação das informações:** Validar nome obrigatório, consistência do preço e integridade dos atributos.
- [x] **RF03 — Persistência:** Armazenar os produtos cadastrados com sucesso em base de dados relacional.
- [x] **RF04 — Rejeição de cadastros inválidos:** Rejeitar e impedir o armazenamento de requisições que violem as regras de negócio.
- [x] **RF05 — Resposta da operação:** Retornar resposta estruturada com os dados do produto criado ou mensagens detalhadas em caso de erro.

---

## 4. Relação de Sub-Issues Planejadas
- [ ] **[SUB-01]** Modelar a Entidade de Domínio `Product` e Invariantes
- [ ] **[SUB-02]** Implementar DTOs de Entrada e Saída com Validações de Contrato
- [ ] **[SUB-03]** Configurar Persistência, Schema de Banco e Repositório de Produtos
- [ ] **[SUB-04]** Implementar o Serviço de Aplicação para Cadastro de Produto
- [ ] **[SUB-05]** Implementar o Controlador HTTP e Rota `POST /products`
- [ ] **[SUB-06]** Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)

---

## 5. Critérios Gerais de Aceite (Definition of Done)
- [ ] **CA01:** Uma requisição contendo dados válidos resulta na criação e persistência do produto, retornando HTTP 201 Created com os dados gerados (incluindo ID).
- [ ] **CA02:** Uma requisição sem nome (ou com nome em branco/nulo) é rejeitada com HTTP 400 Bad Request, sem persistência no banco.
- [ ] **CA03:** Uma requisição com preço inválido (nulo, negativo ou zerado) é rejeitada com HTTP 400 Bad Request, sem persistência no banco.
- [ ] **CA04:** Em cenários de falha de infraestrutura no banco de dados, o sistema devolve HTTP 500 sem vazar dados sensíveis e sem criar registros órfãos.
- [ ] **CA05:** Todas as Sub-Issues foram concluídas, revisadas em Pull Request e aprovadas conforme as diretrizes do repositório.
- [ ] **CA06:** A cobertura de testes automatizados (unitários e de integração/E2E) atesta a conformidade de todos os fluxos e regras.

---

## 6. Dependências Externas e Bloqueios
- **Ambiente de Banco de Dados:** Instância PostgreSQL operacional (local via Docker Compose ou ambiente de homologação).
- **Módulo de Autenticação/Autorização:** Caso a exigência de "usuário autorizado" seja aplicada de imediato, depende da disponibilidade do guard de autenticação global.

---

## 7. Condições de Conclusão e Prontidão
- **Definition of Ready (DoR):** Especificação funcional analisada, contratos técnicos de dados acordados e Sub-Issues refinadas com critérios de aceite testáveis.
- **Definition of Done (DoD):** Código implementado segundo os padrões arquiteturais do NestJS, migrações executadas com sucesso, suíte de testes automatizados com 100% de sucesso e documentação da API atualizada.
```

