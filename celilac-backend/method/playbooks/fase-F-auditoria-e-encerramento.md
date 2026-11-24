# Playbook — Fase F: Auditoria e encerramento

> Procedimento curto e sem dados de projeto. Nomes, comandos e números vêm de `project-profile.md` e de `docs/uc/<uc>/state.yaml`. Regras permanentes: `method/AGENTS.md`.

| Campo | Valor |
|---|---|
| Camada | 1 (Ciclo do UC) |
| Fase | F — Auditoria e encerramento |
| Arquétipos | criar *(validado)* · demais *(esboços; autenticar ganha revisão de segurança dedicada)* |
| Depende de | Fase E aprovada |
| Valida-se com | `check-state.sh --remote` · `check-links.mjs` · CI · revisão humana |

## 1. Objetivo
Verificar, com evidência, **o que o caso de uso realmente entregou**: cobertura item a item do UC, arquitetura em conformidade com os contratos, consistência entre documentos, `state.yaml` e GitHub. Ao final, o caso de uso pode ser encerrado **por uma pessoa**.

## 2. Entradas
### 2.1. Já no repositório (não perguntar)
- `state.yaml`, relatórios A–E, `contrato.md`, evidências, tabela de cobertura da Fase A.
- `project-profile.md` e a estrutura de código esperada do perfil de stack.
### 2.2. A perguntar (somente se faltar)
- **Decisão para cada item sem teste nem ADR** — *é decisão do responsável pelo UC, não do agente: ofereça as opções (implementar, adiar com ADR, excluir com ADR)*.
- **Quem encerra o Epic** — *fechar é ato humano (regra 9)*.

## 3. Gate de entrada
- [ ] Fase E com gate aprovado por pessoa; `check-state.sh --remote` sem erros.
- [ ] CI verde na principal; `bash scripts/verify.sh --completo` (ou equivalente) verde.
- [ ] Nenhum PR do UC aberto sem decisão.

## 4. Passos
1. **Cobertura real** — refazer a tabela da Fase A com a coluna **"teste que prova"** (nome exato do `it`, conferido no código) ou **"não implementado (ADR-NNN)"**. Item sem nenhum dos dois fica `Aguardando decisão`. — evidência: tabela no relatório e `docs/uc/<uc>/evidencias/F/cobertura.md`.
2. **Executar os testes citados** e guardar a saída real (a existência do nome não basta: ele precisa passar). — evidência: `docs/uc/<uc>/evidencias/F/testes.txt`.
3. **Auditoria arquitetural** — mapa de dependências e responsabilidades (regra de negócio no núcleo, adaptadores sem regra, contratos do núcleo preservados). Cada achado recebe etiqueta (regra 4) e vira: correção, ADR ou "sem ação". Hipótese teórica sem problema real **não** vira refatoração. — evidência: `docs/uc/<uc>/evidencias/F/auditoria.md`.
4. **Refatoração (condicional, só se aprovada)** — um PR pequeno por achado priorizado, com a suíte verde antes e depois; sem mudar comportamento nem contrato.
5. **Consistência** — documentos × `state.yaml` × GitHub: `check-state.sh --remote` e `check-links.mjs`. O `state.yaml` vence divergências (regra 15). Apontar tudo que declara "100%" ou "coberto" sem prova.
6. **Apresentar as decisões pendentes** (itens `Aguardando decisão`, achados) à pessoa e **aguardar** as respostas; registrar as ADRs correspondentes.
7. **Relatório final da UC** (`relatorio-de-fase.md`) com cobertura, auditoria, decisões, pendências e aprendizados; `state.yaml` atualizado. Mostrar o gate de saída e **aguardar validação**.
8. **Encerramento (humano)** — a pessoa integra o que falta, fecha as issues (PR integrado e link da evidência, regra 14) e o Epic, e `state.yaml` passa a `fase_atual: concluido` com Epic `closed`. O agente prepara o roteiro; não executa o fechamento.

> Pare e pergunte antes de qualquer ação destrutiva ou irreversível (regra 8): fechar issues/Epic, apagar branches, merge.

## 5. Artefatos
| Artefato | Local | Obrigatório |
|---|---|---|
| Cobertura (item → teste ou ADR) | `docs/uc/<uc>/evidencias/F/cobertura.md` | sim |
| Auditoria arquitetural | `docs/uc/<uc>/evidencias/F/auditoria.md` | sim |
| Saída dos testes citados | `docs/uc/<uc>/evidencias/F/testes.txt` | sim |
| Relatório final | `docs/uc/<uc>/relatorios/F.md` | sim |
| ADRs de adiamento/exclusão | `docs/adr/` | para cada item sem teste |
| `state.yaml` final | `docs/uc/<uc>/state.yaml` | sim |

## 6. Gate de saída
| Verificação | Como | Quem valida |
|---|---|---|
| Todo item do UC tem teste que o prova **ou** ADR | `cobertura.md` + `testes.txt` | pessoa responsável |
| Nenhuma afirmação de cobertura sem prova | revisão do relatório | pessoa responsável |
| Arquitetura em conformidade, achados tratados | `auditoria.md` | pessoa responsável |
| `state.yaml`, documentos e GitHub consistentes | `check-state.sh --remote`, `check-links.mjs` | CI / pessoa |
| CI verde na principal | CI | CI |
| Issues e Epic fechados | GitHub | **pessoa** (ato humano) |

O agente **não** marca `aprovado`, **não** fecha issues nem o Epic (regras 9, 14 e 21).

## 7. Proibições da fase
- Declarar item "coberto" por afirmação, por nome de teste não executado ou por relatório anterior.
- Decidir sozinho sobre item sem teste (implementar, adiar ou excluir).
- Refatorar por hipótese teórica ou alterar comportamento/contrato durante a auditoria.
- Fechar issue, Epic ou fazer merge; reabrir issue fechada para trabalho novo.
- Apagar branches ou histórico de evidências.

## 8. Variações por arquétipo
| Arquétipo | O que muda nesta fase | Validação |
|---|---|---|
| criar | cobertura de RN/FA/FE (lição do UC12: preço, falha de persistência) | validado (UC12) |
| consultar | cobertura de filtros, paginação e não encontrado | esboço |
| atualizar | cobertura de conflito e de estado anterior | validado (UC15) |
| excluir | cobertura de integridade e de ausência após remoção | esboço |
| autenticar | **revisão de segurança dedicada** (credenciais, vazamento em resposta e log) | esboço |

## 9. Erros comuns
- "100% coberto" sem tabela → copiado de relatório anterior → refazer item a item, com teste executado.
- Teste citado não existe ou não passa → nome de memória → conferir no código e rodar.
- Achado vira refatoração grande → hipótese sem problema real → classificar e só agir com evidência.
- Documento diz uma coisa e o GitHub outra → reconciliação esquecida → `check-state.sh --remote` e corrigir pelo `state.yaml`.

## 10. Para o estudante
- **O que esta fase ensina:** auditar com evidência e distinguir "implementado", "testado" e "decidido".
- **Pergunte-se:** (1) para cada item do UC, qual teste exato o prova? (2) o que ficou sem prova e quem decidiu? (3) algum documento afirma algo que eu não conferi?
- **Documento didático relacionado:** `method/didatico/05-as-seis-fases-e-seus-playbooks.md`.
