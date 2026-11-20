# ARTEFATO 12-04 — PRIORIZAÇÃO E MATRIZ DE DECISÕES TÉCNICAS

## 1. Critérios de Julgamento Técnico para Priorização

Conforme as diretrizes do Material 12, intervenções de refatoração só devem ser realizadas mediante **problemas técnicos demonstráveis** com evidências objetivas e quando o benefício arquitetural superar o risco de regressão.

Não se deve inventar problemas artificiais ou executar alterações cosméticas apenas para gerar histórico de commits ou alterações em diff.

---

## 2. Matriz de Avaliação dos Achados e Hipóteses

| Item / Achado | Evidência Concreta | Impacto Arquitetural | Risco de Regressão | Benefício Esperado | Esforço | Cobertura de Testes | Prioridade | Decisão Técnica Fundamentada |
|---|---|---|---|---|---|---|---|---|
| **H-01: Controller acessando ORM** | `ProductsController.ts` importa apenas `ProductsService`. Grep por `typeorm` = 0. | Nenhum (defeito inexistente) | Alto (se alterado sem motivo) | Nulo | Nulo | 3 testes no controller | N/A | **Descartar Hipótese (Preservar Código)** |
| **H-02: Service dependente de infraestrutura** | `ProductsService.ts` injeta `PRODUCTS_REPOSITORY`. Grep por `typeorm` = 0. | Nenhum (defeito inexistente) | Alto | Nulo | Nulo | 1 teste de unidade + 2 de integração | N/A | **Descartar Hipótese (Preservar Código)** |
| **H-03: Tipos de ORM na interface de repositório** | `products.repository.interface.ts` usa apenas `Product`. | Nenhum (defeito inexistente) | Alto (quebra de contratos) | Nulo | Nulo | 6 testes rápidos + 1 de integração | N/A | **Descartar Hipótese (Preservar Código)** |
| **H-04: Duplicação de mapeamento HTTP** | `ProductsController.ts:21` usa `toProductResponse(product)`. | Nenhum (defeito inexistente) | Médio | Nulo | Nulo | Teste fechado de serialização | N/A | **Descartar Hipótese (Preservar Código)** |
| **H-05: Inconsistência nos Providers do NestJS** | `products.module.ts` registra provider e `forFeature` perfeitamente. | Nenhum (defeito inexistente) | Crítico | Nulo | Nulo | Testes rápidos e chamada HTTP real | N/A | **Descartar Hipótese (Preservar Código)** |
| **OBS-01: Warnings de unused vars em módulos externos (ex: orders)** | Linter reporta 12 warnings em `src/modules/orders/` e scripts auxiliares. | Baixo (fora do escopo do UC12) | Baixo para orders, nulo para produtos | Cosmético | Baixo | Testes de orders possuem falhas pré-existentes | Baixa | **Adiar / Fora de Escopo** (Preservar isolamento do UC12) |
| **EST-01: Arquitetura atual do UC12** | 6 testes rápidos, 1 teste PostgreSQL, build verde, 0 erros no lint. | Alto e positivo | Nulo ao preservar | Estabilidade e conformidade com os requisitos | Nulo | 100% dos testes do UC12 aprovados | Máxima | **Preservar Arquitetura Existente (Cenário B)** |

---

## 3. Análise de Alternativas Consideradas

### Alternativa 1: Refatoração Artificial de Cosmética (Cenário A forçado)
* **Descrição:** Renomear métodos, alterar nomes de variáveis ou trocar a estrutura de pastas do `UC12` para forçar um diff de código.
* **Avaliação:** Viola o princípio central do Material 12: *"Não realize alterações cosméticas apenas para produzir um diff. Não invente problemas para justificar refatorações"*. Introduz risco de quebra de compatibilidade com os testes e clientes existentes.
* **Conclusão:** **Rejeitada**.

### Alternativa 2: Intervenção em Módulos Fora do Escopo (ex: `src/modules/orders`)
* **Descrição:** Corrigir os warnings de linter e testes de `orders` durante a auditoria de produtos.
* **Avaliação:** Fere o escopo acordado da atividade (UC12 — Cadastrar Produto). Modificar código não relacionado sem planejamento e sem Issue específica aumenta o WIP e compromete a rastreabilidade do projeto.
* **Conclusão:** **Rejeitada**.

### Alternativa 3: Preservação Integral Justificada da Arquitetura (Cenário B)
* **Descrição:** Manter a implementação do `UC12` exatamente como consolidada no Material 11, formalizando a auditoria com evidências concretas e fundamentação técnica de que a separação de responsabilidades, contratos e composição estão adequados.
* **Avaliação:** Adere integralmente às boas práticas de engenharia de software e ao objetivo pedagógico do Material 12.
* **Conclusão:** **Adotada**.

---

## 4. Declaração da Decisão Técnica

A equipe técnica decide formalmente pelo **CENÁRIO B — PRESERVAÇÃO ARQUITETURAL JUSTIFICADA**. 

A auditoria comprova que a arquitetura do caso de uso `UC12 — Cadastrar Produto` encontra-se íntegra, estável, desacoplada e devidamente testada, não havendo débitos técnicos imediatos que exijam alterações no código de produção.
