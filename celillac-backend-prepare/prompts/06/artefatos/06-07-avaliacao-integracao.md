# ARTEFATO 06-07 — AVALIAÇÃO DA INTEGRAÇÃO CONTROLADA E GOVERNANÇA DE MERGE

## 1. Princípios Metodológicos e Distinção Obrigatória (Refinamento 2)

A Engenharia de Software rigorosa exige distinguir claramente quatro estados de maturidade de uma alteração antes de qualquer operação no repositório:

```text
[ Estado A: Tecnicamente Revisado ]
               │
               ▼
[ Estado B: Aprovado Tecnicamente ]
               │
               ▼
[ Estado C: Autorizado para Merge ]
               │
               ▼
[ Estado D: Efetivamente Integrado ]
```

- **Aprovação Técnica NÃO É Autorização para Merge:** Mesmo que uma revisão de código seja 100% favorável e todos os testes unitários passem, o merge para a linha principal (`main`) ou para branches de integração exige a verificação de completude de escopo, regras de proteção, ausência de regressões em cadeia e autorização formal da equipe gestora (ex.: *Tech Lead* ou *Product Owner*).
- **O Merge não é obrigatório:** A conclusão da unidade didática (Material 06) **não exige a realização de merge prematuro**.

---

## 2. Avaliação Individual dos Critérios de Integração

A avaliação foi realizada de forma segregada para cada Pull Request dependente:

| Critério de Integração | Draft PR #12 (`SUB-07`) | Draft PR #13 (`SUB-05`) | Justificativa Técnica |
| :--- | :---: | :---: | :--- |
| **1. Implementação pronta conforme escopo** | **Não atende** | **Não atende** | A `SUB-07` requer testes para os fluxos alternativos (`CA02`, `CA03`). A `SUB-05` requer regras de negócio completas do serviço. |
| **2. Critérios de aceite do caso de uso atendidos** | **Não atende** | **Não atende** | Apenas `CA01` foi desenvolvido e testado; `CA02`, `CA03` e `FE01` continuam pendentes. |
| **3. Testes aplicáveis aprovados** | **Não atende (isolado)** | **Atende (composto)** | Isoladamente na branch do PR #12 o teste falha com `Not implemented` (fase RED). No PR #13 (composto), 8/8 testes passam. |
| **4. Verificações obrigatórias (CI/Checks)** | **Atende** | **Atende** | Nenhuma checagem impeditiva ou falha sintática detectada. |
| **5. Revisão técnica concluída** | **Atende** | **Atende** | Revisão técnica individualizada documentada no Artefato `06-05`. |
| **6. Comentários bloqueantes resolvidos** | **Atende** | **Atende** | Diretrizes de governança cumpridas mantendo o isolamento e modo Draft. |
| **7. Branch-base correta** | **Atende (`main`)** | **Atende (`PR #12`)** | Hierarquia de branches tecnicamente correta. |
| **8. Ausência de conflitos pendentes** | **Atende** | **Atende** | Sem conflitos de mesclagem com as respectivas bases. |
| **9. Regras de proteção de branch respeitadas** | **Atende** | **Atende** | Nenhuma alteração direta foi injetada na `main`. |
| **10. Autorização formal para merge** | **Não atende** | **Não atende** | Não há autorização explícita de gestor/PO para mesclagem na `main`. |
| **Classificação de Estado Atual** | **Estado A** | **Estado A** | Tecnicamente revisados; não autorizados para merge. |
| **Decisão Individual de Integração** | **C — Não recomendada** | **C — Não recomendada** | Preservar em Draft. |

---

## 3. Análise dos Riscos de Integração Prematura

1. **Risco de Integração do PR #12 na `main`:**
   - A branch `feature/uc12-07-product-registration-test` possui o teste `CA01` e um esqueleto que lança exceção proposital. Se mesclado à `main`, quebraria a compilação/testes da linha principal para toda a equipe.
2. **Risco de Integração do PR #13 na `main`:**
   - A branch `feature/uc12-05-products-service` aponta para o PR #12, não para a `main`. Fazer merge direto exigiria alterar a base ou mesclar em cascata, introduzindo código parcial onde ainda não há rejeição para nomes vazios (`CA02`) nem tratamento de erro de persistência (`FE01`).
3. **Risco de Falso Sucesso:**
   - Considerar `CA01` aprovado como "UC12 concluído" mascararia que 75% dos fluxos e regras de negócio ainda não foram implementados.

---

## 4. Decisão Consolidada de Integração

Apresenta-se formalmente a decisão para a etapa atual:

### **Opção C — Integração NÃO recomendada no momento.**

**Justificativa Consolidada:**
1. Os Pull Requests cumpriram com perfeição os estágios iniciais de TDD (RED e GREEN para `CA01`), mas representam fatias incrementais de trabalho (*work in progress*).
2. Existem critérios de aceite impeditivos pendentes no caso de uso (`CA02`, `CA03`, `FE01`).
3. Ambos os PRs permanecem no **Estado A (Tecnicamente Revisados)**, não possuindo autorização para merge nem condições de completude para encerramento.

---

## 5. Próximas Ações e Condições para Futura Integração

Para que os Pull Requests possam avançar para o **Estado B (Aprovado Tecnicamente)**, **Estado C (Autorizado para Merge)** e subsequente **Estado D (Integrado)**, deverão ser atendidas as seguintes condições:

1. **Ciclo TDD para `CA02`:**
   - Especificar teste de rejeição de nome vazio/ausente na `SUB-07`.
   - Implementar validação correspondente na `SUB-05` ou `SUB-03`.
2. **Ciclo TDD para `CA03` e `FE01`:**
   - Garantir que produto inválido não invoca o repositório (`expect(save).not.toHaveBeenCalled()`).
   - Tratar exceção de falha de persistência.
3. **Revisão Independente por Pares:**
   - Submissão dos PRs a aprovação humana independente (revisão cruzada).
4. **Consolidação das Branches:**
   - Composição do PR #13 na branch do PR #12 (ou estratégia equivalente definida pelo Tech Lead) para validação integral da suíte.
5. **Autorização Formal para Merge:**
   - Obtenção da autorização explícita do mantenedor do repositório antes de qualquer mesclagem na `main`.

