# Playbook — Fase A: Planejar e publicar

> Procedimento curto e sem dados de projeto. Nomes, comandos e números vêm de `project-profile.md` e de `docs/uc/<uc>/state.yaml`. Regras permanentes: `method/AGENTS.md`.

| Campo | Valor |
|---|---|
| Camada | 1 (Ciclo do UC) |
| Fase | A — Planejar e publicar |
| Arquétipos | criar *(validado)* · consultar *(validado, UC13 e UC14)* · atualizar *(validado, UC15)* · excluir, autenticar *(esboços, ver `matriz-arquetipos.md`)* |
| Depende de | Fundação concluída (Camada 0) |
| Valida-se com | `method/scripts/check-state.sh` (com `--remote`) · `node method/scripts/check-links.mjs` · revisão humana |

## 1. Objetivo
Transformar o documento do caso de uso em um plano **publicado e rastreável**: Epic, Sub-Issues de fatias, quadro do GitHub Project e `state.yaml` reconciliados entre si, com cada fatia pronta para começar (DoR).

## 2. Entradas
### 2.1. Já no repositório (não perguntar)
- `project-profile.md` (repositório, GitHub Project, convenções de branch e commit, equipe).
- `method/templates/` (`state.yaml`, `issue-fatia.md`, `relatorio-de-fase.md`, `adr.md`) e `method/playbooks/guia-decomposicao-em-fatias.md`.
- Formulários de issue em `.github/ISSUE_TEMPLATE/` (fatia e fase).
### 2.2. A perguntar (somente se faltar)
- **Caminho do documento do caso de uso** e o código do UC (ex.: `UC13`) — *necessário para criar `docs/uc/<uc>/`; o caminho vai no campo `documento` do `state.yaml`, que o validador confere*.
- **Arquétipo** (criar, consultar, atualizar, excluir, autenticar) — *define o catálogo de fatias*.
- **Responsável e revisor** de cada fatia — *DoR exige responsável; no modo solo, nomeie os papéis (não conta como revisão independente)*.
- **Rótulos e Project:** reaproveitar os existentes ou criar? — *evita duplicar o que já existe (regra 5)*.

## 3. Gate de entrada
- [ ] Fundação concluída: CI verde na branch principal e `project-profile.md` sem itens críticos `a confirmar`.
- [ ] `gh auth status` válido (se a publicação for via `gh`).
- [ ] O documento do UC foi lido por completo e não há lacuna que impeça cortar fatias (senão, pergunte).

## 4. Passos
1. **Analisar o UC** — listar todos os itens (RF, RN, fluxos principal/alternativos/exceção, CA). Marcar lacunas como `a confirmar`. — evidência: tabela de itens no relatório.
2. **Decompor em fatias** seguindo o guia de fatias (um comportamento, RED nomeado, ordem feliz → validação → regra → falha). — verificar: todo item do UC termina em uma fatia, em uma decisão ou em uma pergunta.
3. **Montar a tabela de cobertura** (item do UC → fatia | ADR de adiamento | pergunta). Itens fora do escopo ou adiados exigem ADR curta (template `adr.md`). — evidência: tabela no relatório e ADRs.
4. **Aplicar a DoR** a cada fatia: objetivo, escopo, critérios verificáveis, dependências, informações disponíveis, responsável e revisão concluída. A fatia vai a `Ready` somente se atender aos sete itens; sem revisão humana registrada, fica em `Backlog`. — evidência: tabela de DoR.
5. **Criar `docs/uc/<uc>/state.yaml`** a partir do template (epic, fatias com `criterios`, gates da fase A). — verificar: `method/scripts/check-state.sh docs/uc/<uc>/state.yaml` sem erros.
6. **Apresentar o plano e aguardar aprovação** antes de publicar qualquer coisa no GitHub. Publicar é ato externo e visível.
7. **Publicar (após aprovação)** — inspecionar antes de criar (regra 5): rótulos → Epic → uma Sub-Issue por fatia (formulário `fatia.yml`) vinculada ao Epic → issue da própria fase quando houver trabalho (formulário `fase.yml`). Registrar os números **reais** retornados. — evidência: saída dos comandos em `docs/uc/<uc>/evidencias/A/`.
8. **Configurar o GitHub Project** com os cinco estados (`Backlog`, `Ready`, `In Progress`, `In Review`, `Done`), adicionar Epic e Sub-Issues e posicionar cada item (`Backlog` ou `Ready`, conforme a DoR). — evidência: listagem do Project.
9. **Reconciliar:** atualizar o `state.yaml` com issues reais e rodar `check-state.sh --remote`. O `state.yaml` vence qualquer divergência (regra 15).
10. **Relatório da fase** (`relatorio-de-fase.md`) e `check-links.mjs`. Mostrar o gate de saída e **aguardar validação**.

> Pare e pergunte antes de qualquer ação destrutiva ou irreversível (regra 8): em especial fechar ou apagar issues, apagar rótulos ou mover itens de outro planejamento.

## 5. Artefatos
| Artefato | Local | Obrigatório |
|---|---|---|
| Relatório da fase (itens do UC, fatias, cobertura, DoR) | `docs/uc/<uc>/relatorios/A.md` | sim |
| `state.yaml` | `docs/uc/<uc>/state.yaml` | sim |
| Evidências da publicação | `docs/uc/<uc>/evidencias/A/` | sim |
| ADR de adiamento ou exclusão | `docs/adr/` | se houver decisão |

## 6. Gate de saída
| Verificação | Como | Quem valida |
|---|---|---|
| Todo item do UC mapeado (fatia, ADR ou pergunta) | tabela de cobertura no relatório | pessoa responsável |
| Epic e Sub-Issues existem e conferem com o `state.yaml` | `check-state.sh --remote` | CI / pessoa |
| Cada fatia tem teste RED nomeado e DoR avaliada | tabela de DoR | pessoa responsável |
| Project com os cinco estados e itens posicionados | listagem em `docs/uc/<uc>/evidencias/A/` | pessoa responsável |
| Links e caminhos dos documentos existem | `check-links.mjs` | CI |

O agente **não** marca `aprovado` (regras 9 e 21).

## 7. Proibições da fase
- Publicar no GitHub sem a aprovação do plano (passo 6).
- Criar fatias "só de teste", "só de DTO" ou "só de controller", ou sub-issues por camada técnica.
- Inventar número de issue, PR ou URL; reutilizar issue fechada para trabalho novo.
- Declarar item do UC "coberto" sem fatia ou decisão registrada.
- Implementar código: a fase A só planeja.

## 8. Variações por arquétipo
| Arquétipo | O que muda nesta fase | Validação |
|---|---|---|
| criar | catálogo típico no guia de fatias (seção 5) | validado (UC12) |
| consultar | fatias de leitura, sem efeito colateral; atenção a filtros e paginação | validado (UC13, UC14) |
| atualizar | acrescenta fatias de estado anterior e conflito | validado (UC15) |
| excluir | acrescenta política de remoção e integridade | esboço |
| autenticar | segurança entra como item de planejamento | esboço |

## 9. Erros comuns
- Fatias por camada (DTO, controller) → confundir fatia com etapa técnica → recortar por comportamento observável (ADR-003).
- "100% de cobertura" no planejamento → afirmação sem tabela → refazer a tabela item a item.
- Issues duplicadas → não inspecionou antes de criar → listar issues e rótulos existentes primeiro.
- Epic com lista de issues divergente do `state.yaml` → publicação feita sem reconciliar → rodar `check-state.sh --remote` e corrigir pelo `state.yaml`.
- Fatia em `Ready` sem revisão humana → DoR-07 ignorada → manter em `Backlog`.

## 10. Para o estudante
- **O que esta fase ensina:** planejar por comportamento, medir cobertura com tabela e publicar de forma rastreável.
- **Pergunte-se:** (1) algum item do UC ficou sem fatia nem decisão? (2) cada fatia tem um teste RED que eu consigo nomear agora? (3) o que no plano depende de uma decisão que não é minha?
- **Documento didático relacionado:** `method/didatico/05-as-seis-fases-e-seus-playbooks.md`.
