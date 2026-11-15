# ARTEFATO 06 — APLICAÇÃO DA DEFINITION OF READY (DoR)

> **Regra de Governança da Definition of Ready:**
> Uma Sub-Issue somente pode ser movida para a coluna **`Ready`** no GitHub Project quando **todas as sete condições (`DoR-01` a `DoR-07`)** estiverem classificadas como **`Atende`**.
> - A existência de dependências técnicas ainda não implementadas (`DoR-04`) **não impede automaticamente** uma Issue de atingir `Ready`, desde que as dependências estejam identificadas e os contratos/definições necessários para iniciar o trabalho estejam disponíveis (`DoR-05`).
> - Entretanto, **a ausência de confirmação de informações essenciais da especificação (`DoR-05`), a falta de Assignee confirmado no GitHub (`DoR-06`) ou a ausência de evidência da revisão humana concluída (`DoR-07`) impedem obrigatoriamente a classificação como `Ready`.**

---

## 6.1 As Sete Condições da Definition of Ready (DoR)

| Código | Condição | Critério de Avaliação Aplicado |
| :--- | :--- | :--- |
| **DoR-01** | **Objetivo claramente definido** | A Issue descreve de forma inequívoca o resultado técnico pretendido. |
| **DoR-02** | **Escopo delimitado** | O trabalho está suficientemente delimitado, indicando o que faz parte e o que está fora do escopo. |
| **DoR-03** | **Critérios de aceite verificáveis** | Os critérios permitem verificar objetivamente a conclusão futura da atividade (testáveis e sem ambiguidade). |
| **DoR-04** | **Dependências identificadas** | As dependências técnicas relevantes entre Sub-Issues estão mapeadas e registradas. |
| **DoR-05** | **Informações disponíveis** | Todas as informações funcionais, regras de negócio, atributos e contratos necessários para iniciar a implementação estão disponíveis e confirmados. |
| **DoR-06** | **Responsável definido** | Existe um responsável (*Assignee*) identificado para a execução (proposto neste planejamento e registrado na Issue). |
| **DoR-07** | **Revisão concluída** | A revisão cruzada do planejamento foi **efetivamente concluída pelo revisor humano designado** e registrada na Issue. |

*Classificações permitidas:* **`Atende`** | **`Não atende`** | **`Não foi possível verificar`**.

---

## 6.2 Tabela de Avaliação da Definition of Ready por Sub-Issue (`SUB-01` a `SUB-08`)

> **Nota sobre `DoR-06`:** Embora este planejamento já tenha definido os responsáveis na matriz de distribuição (`Artefato 03`), nas descrições originais das Issues recebidas da Etapa 1 o campo constava como `"A definir"` e não há confirmação de que já foram atribuídos no GitHub. Por rigor metodológico, `DoR-06` é avaliado como **`Atende (no planejamento) / Pendente de registro no GitHub`**, e `DoR-07` é avaliado como **`Não atende`** em todas as Issues porque **nenhuma revisão humana foi efetivamente executada e comprovada ainda**.

| ID da Issue | DoR-01 (Objetivo) | DoR-02 (Escopo) | DoR-03 (Critérios) | DoR-04 (Dependências) | DoR-05 (Informações Disponíveis) | DoR-06 (Responsável Definido) | DoR-07 (Revisão Humana Concluída) | Resultado Global da DoR | Pendências Impeditivas para `Ready` | Status Recomendado Atual |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **SUB-01** (`Entidade Product`) | **Atende** | **Atende** | **Atende** | **Atende** | **Não atende** | **Atende** *(definido: `@anaclara-dev`; pendente aplicar no GitHub)* | **Não atende** | **Não apta a Ready** | 1. **DoR-05:** Confirmar na especificação original a lista completa de atributos e tipos de `Product` além de nome e preço.<br>2. **DoR-06:** Registrar `@anaclara-dev` na Issue no GitHub.<br>3. **DoR-07:** Concluir e registrar a revisão humana por `@bruno-oliveira`. | **`Backlog`** |
| **SUB-02** (`DTO Cadastro`) | **Atende** | **Atende** | **Atende** | **Atende** | **Não atende** | **Atende** *(definido: `@carlamendes`; pendente aplicar no GitHub)* | **Não atende** | **Não apta a Ready** | 1. **DoR-05:** Confirmar campos completos do DTO de entrada e formato exato da estrutura de resposta (`RF05`).<br>2. **DoR-06:** Registrar `@carlamendes` na Issue no GitHub.<br>3. **DoR-07:** Concluir e registrar a revisão humana por `@diego-almeida`. | **`Backlog`** |
| **SUB-03** (`Validações`) | **Atende** | **Atende** | **Atende** | **Atende** *(requer fixar camada)* | **Não atende** | **Atende** *(definido: `@bruno-oliveira`; pendente aplicar no GitHub)* | **Não atende** | **Não apta a Ready** | 1. **DoR-05:** Confirmar na especificação original os critérios exatos de validade do nome (`RN01`) e do preço (`RN02`), além da camada de validação.<br>2. **DoR-06:** Registrar `@bruno-oliveira` no GitHub.<br>3. **DoR-07:** Concluir e registrar a revisão humana por `@anaclara-dev`. | **`Backlog`** |
| **SUB-04** (`Persistência e Repositório`) | **Atende** | **Atende** | **Atende** | **Atende** | **Não atende** | **Atende** *(definido: `@bruno-oliveira`; pendente aplicar no GitHub)* | **Não atende** | **Não apta a Ready** | 1. **DoR-05:** Confirmar os atributos e restrições de banco da entidade `Product` (`SUB-01`).<br>2. **DoR-06:** Registrar `@bruno-oliveira` no GitHub.<br>3. **DoR-07:** Concluir e registrar a revisão humana por `@anaclara-dev`. | **`Backlog`** |
| **SUB-05** (`Serviço de Aplicação`) | **Atende** | **Atende** | **Atende** | **Atende** | **Não atende** | **Atende** *(definido: `@anaclara-dev`; pendente aplicar no GitHub)* | **Não atende** | **Não apta a Ready** | 1. **DoR-05:** Definir o contrato de retorno/exceção para falhas (`FA01`, `FA02`, `FE01`) e consolidar contratos de `SUB-01` a `SUB-04`.<br>2. **DoR-06:** Registrar `@anaclara-dev` no GitHub.<br>3. **DoR-07:** Concluir e registrar a revisão humana por `@carlamendes`. | **`Backlog`** |
| **SUB-06** (`Endpoint POST /products`) | **Atende** | **Atende** | **Atende** | **Atende** | **Não atende** | **Atende** *(definido: `@carlamendes`; pendente aplicar no GitHub)* | **Não atende** | **Não apta a Ready** | 1. **DoR-05:** Confirmar códigos de status HTTP padronizados e regra de permissão/autorização do ator principal.<br>2. **DoR-06:** Registrar `@carlamendes` no GitHub.<br>3. **DoR-07:** Concluir e registrar a revisão humana por `@diego-almeida`. | **`Backlog`** |
| **SUB-07** (`Testes Automatizados`) | **Atende** | **Atende** | **Atende** | **Atende** | **Não atende** | **Atende** *(definido: `@diego-almeida`; pendente aplicar no GitHub)* | **Não atende** | **Não apta a Ready** | 1. **DoR-05:** Confirmar limites exatos de `RN01`/`RN02` e status HTTP de `SUB-06` para asserções dos testes.<br>2. **DoR-06:** Registrar `@diego-almeida` no GitHub.<br>3. **DoR-07:** Concluir e registrar a revisão humana por `@bruno-oliveira`. | **`Backlog`** |
| **SUB-08** (`Documentação Técnica`) | **Atende** | **Atende** | **Atende** | **Atende** | **Não atende** | **Atende** *(definido: `@diego-almeida`; pendente aplicar no GitHub)* | **Não atende** | **Não apta a Ready** | 1. **DoR-05:** Confirmar arquivo de documentação alvo no repositório e contratos finais de `SUB-02` e `SUB-06`.<br>2. **DoR-06:** Registrar `@diego-almeida` no GitHub.<br>3. **DoR-07:** Concluir e registrar a revisão humana por `@carlamendes`. | **`Backlog`** |

---

## 6.3 Explicação Técnica do Resultado da DoR (Divergência Construtiva em Relação à Etapa 1)

Na Etapa 1 (*"Do Caso de Uso ao Planejamento da Implementação"*), as Sub-Issues **`SUB-01`** e **`SUB-02`** haviam recebido a recomendação preliminar de iniciar em **`Ready`** unicamente porque não dependiam tecnicamente de outras Sub-Issues anteriores.

Entretanto, ao aplicar rigorosamente as **7 condições da Definition of Ready (DoR)** nesta Etapa 2:
1. **Nenhuma Sub-Issue possui revisão humana comprovada (`DoR-07 = Não atende`):** A pré-análise da IA prepara os insumos, mas a DoR exige que o colega revisor designado valide a Issue e publique seu comentário de conclusão no GitHub.
2. **Existem pendências explícitas de confirmação na especificação original (`DoR-05 = Não atende`):** Mesmo `SUB-01` e `SUB-02` dependem de saber se o produto no CeliLac possui outros atributos obrigatórios além de `nome` e `preço` (ex.: indicação de restrição a glúten/lactose, descrição, categoria) e qual é o payload de resposta esperado.
3. **Consequência Prática para o Board:**
   - **No momento atual (antes da ação humana no GitHub):** **0 Issues** estão aptas a `Ready` e **todas as 8 Sub-Issues (`SUB-01` a `SUB-08`) + `EPIC-UC12` devem permanecer em `Backlog`**.
   - **Imediatamente após a equipe confirmar as dúvidas na especificação original, atualizar os textos e registrar os comentários de revisão humana no GitHub:**
     - `SUB-01` e `SUB-02` serão as primeiras a atingir 100% da DoR (`DoR-01` a `DoR-07` = `Atende`) e poderão ser movidas para **`Ready`** imediatamente.
     - `SUB-03`, `SUB-04` e demais Sub-Issues também poderão avançar para **`Ready`** assim que os contratos de suas interfaces (`Product` e `DTO`) e regras (`RN01`, `RN02`, status HTTP) estiverem congelados e revisados, mesmo antes da conclusão do código das predecessoras, caso as definições já permitam iniciar o trabalho.

