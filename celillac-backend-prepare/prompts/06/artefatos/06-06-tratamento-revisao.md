# ARTEFATO 06-06 — TRATAMENTO DAS OBSERVAÇÕES E COMENTÁRIOS DE REVISÃO

## 1. Mapeamento das Observações e Comentários Registrados

| ID | Origem / PR | Autor | Arquivo / Trecho | Observação Técnica | Classificação |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **OBS-01** | [PR #12](https://github.com/evertonfoz/dsc-tests/pull/12#issuecomment-6579354760) | Everton Coimbra (`@evertonfoz`) | `products.service.ts` e `products.service.spec.ts` | Teste RED aprovado no escopo de `CA01`. Manter PR em Draft até implementação GREEN e não realizar merge na `main` para evitar quebra de build. | **Diretriz de Governança / Bloqueante para Merge** |
| **OBS-02** | [PR #12](https://github.com/evertonfoz/dsc-tests/pull/12) / Artefato 06-05 | Revisão Técnica | `src/modules/products/services/products.service.spec.ts:32-36` | Refinar a asserção de chamada ao repositório para validar o payload exato (`toHaveBeenCalledWith(expect.objectContaining({ name: 'Celular XYZ' }))`). | **Sugestão de Melhoria (Não Bloqueante)** |
| **OBS-03** | [PR #13](https://github.com/evertonfoz/dsc-tests/pull/13) / Artefato 06-05 | Revisão Técnica | `src/modules/products/services/products.service.ts:16-19` | Avaliar se a geração de UUID deveria ser delegada a um método fábrica na entidade `Product`. | **Sugestão Arquitetural (Opcional)** |
| **OBS-04** | Ambos os PRs | Revisão de Escopo UC12 | Regras de Negócio `RN01`, `RN03` e Fluxos `FA01`, `FE01` | Critérios `CA02` (rejeição de nome vazio) e `CA03` (não persistência) ainda não implementados no serviço nem cobertos por testes. | **Pendência Funcional de Escopo** |

---

## 2. Decisões Técnicas e Tratamento das Observações

### 2.1 Tratamento da OBS-01 (Governança do PR #12)
- **Decisão:** **Acatada integralmente.**
- **Ação Realizada:** O Draft PR #12 foi mantido em modo Draft; a branch `main` não recebeu merge prematuro, prevenindo a introdução de testes falhando na linha principal.
- **Evidência:** Estado do PR no GitHub verificado como `Draft` (`open`).

### 2.2 Tratamento da OBS-02 (Refinamento de asserções em `products.service.spec.ts`)
- **Decisão:** **Adiada para o próximo ciclo de testes da `SUB-07`.**
- **Justificativa Técnica:** O arquivo `products.service.spec.ts` pertence ao escopo da `SUB-07` (PR #12). Modificá-lo na branch ativa `feature/uc12-05-products-service` (PR #13) misturaria responsabilidades de implementação de serviço com manutenção da suíte de testes. A melhoria será introduzida na branch de testes quando os novos testes de `CA02` forem adicionados.
- **Situação:** Documentada e planejada como débito técnico menor.

### 2.3 Tratamento da OBS-03 (Método Fábrica em `Product`)
- **Decisão:** **Rejeitada com fundamentação técnica.**
- **Justificativa Técnica:** A entidade `Product` possui construtor simples e imutável. Instanciar `new Product(randomUUID(), name)` no serviço de aplicação respeita o princípio da responsabilidade única e evita overengineering. O construtor público continua necessário para as operações da camada de persistência (`SUB-04`).
- **Situação:** Resolvida sem alteração de código.

### 2.4 Tratamento da OBS-04 (Pendências Funcionais de `CA02` e `CA03`)
- **Decisão:** **Preservada para os próximos ciclos TDD.**
- **Justificativa Técnica:** No TDD estrito, regras de negócio como obrigatoriedade de campos devem ser desenvolvidas sob o ciclo RED → GREEN → REFACTOR. Antecipar essas regras neste momento violaria o escopo do critério `CA01`.
- **Situação:** Registrada como trabalho pendente obrigatório antes da integração final do caso de uso.

---

## 3. Matriz de Rastreabilidade e Resolução

| ID | Classificação | Decisão | Alteração de Código Realizada? | Justificativa / Evidência | Status |
| :---: | :---: | :---: | :---: | :--- | :---: |
| **OBS-01** | Bloqueante | Acatada | Não (governança) | PR #12 preservado em Draft no GitHub | **Resolvido** |
| **OBS-02** | Melhoria | Adiada | Não | Escopo de testes (SUB-07); agendado para ciclo de CA02 | **Planejado** |
| **OBS-03** | Arquitetural | Rejeitada | Não | Construtor público e KISS mantidos | **Resolvido** |
| **OBS-04** | Escopo | Preservada | Não | Exige novos ciclos TDD (RED prévio) | **Pendente** |

---

## 4. Necessidade de Nova Revisão

Como as decisões técnicas mantiveram a integridade dos contratos sem alterações no código-fonte nesta etapa, **não houve introdução de novo risco ou código não inspecionado**. A suíte de testes permanece 100% aprovada (8/8 testes).

Uma nova rodada de revisão técnica formal será requerida após a implementação dos próximos ciclos TDD referentes aos critérios `CA02`, `CA03` e `FE01`.

