# Resumo da execução do UC14 — Buscar Produto por Identificador

Texto para o estudante ler com calma. Só entram fatos obtidos nesta execução (2026-11-23). Números de issue e de commit vieram de comandos do `gh` e do `git`.

## 1. Ponto de partida
O prompt `uc-buscar.md` pede o ciclo completo de **um** caso de uso de busca de **uma** entidade: especificar (Etapa 1), parar no gate e só então implementar (Etapa 2). A execução começou com as perguntas iniciais, sem buscar nem gravar nada. O estudante respondeu que ainda não tinha o caso de uso e pediu que o assistente o criasse na pasta do prompt.

## 2. Decisões do estudante
| Decisão | Valor |
|---|---|
| Entidade (`ENTIDADE`) | `Product` |
| Referência (`REF`) | UC12 — Cadastrar Produto |
| Chave (`CHAVE`) | `productId` (UUID) |
| Campos (`CAMPOS`) | `productId` e `name` |
| Código (`ALVO`) | UC14 |
| Ator | busca pública por enquanto, sem autenticação |
| Rota | `GET /products/:productId` |
| Produto removido (soft delete) | tratado como inexistente (`404`) |
| Identificador malformado | pipe de UUID, exceção específica, `400` no formato do `ValidationPipe`, qualquer versão de UUID |
| Nomes das exceções | `ProductNotFoundException`, `InvalidProductIdException`, `ProductLookupFailedException` |
| Artefatos | pasta `prompts/`, versionados em commit |
| Branch | uma única, `feature/uc14-buscar-produto` |
| PR | só depois de todo o fluxo |
| Fechar issues | somente no encerramento |

## 3. Etapa 1
Busca real no repositório e no GitHub: nenhuma especificação, rota, método ou issue de busca de produto existia. **Decisão A: não existe.** Documentos criados em `prompts/`: `uc-14-buscar-produto.md` (13 seções, aprovado pelo estudante), `00-uc-referencia.md`, `01-existencia-do-uc.md` e `03-planejamento-github.md`.

## 4. Planejamento no GitHub
Epic **#126**; fatias **#127** (F01), **#128** (F02), **#129** (F03), **#130** (F04), **#131** (F05); issues de fase **#132** (A), **#133** (C1), **#134** (C2), **#135** (D), **#136** (E), **#137** (F). Todas no Project #6, reaproveitado do UC13. O `state.yaml` está em `docs/uc/uc14/state.yaml`. O gate da Fase A foi aprovado pelo estudante.

## 5. Etapa 2
- **Núcleo:** `findActiveById` no contrato do Repository (aditivo), repositório em memória, `getProductById` no serviço, três exceções novas e o pipe de UUID.
- **HTTP:** `GET /products/:productId`, reaproveitando o DTO e o mapper de resposta; o filtro de exceções mapeia `404`, `400` e `500`.
- **Persistência:** `findActiveById` no TypeORM, sem migration (`productId` já é chave primária).
- **Contrato:** `docs/uc/uc14/contrato.md`.
- **Cenários `.http`:** `http-rest-client/products/uc14-buscar-produto/`, `containerizado/04-products-buscar-produto.http` e 8 checagens novas no `run-checks.sh`.
- **Auditoria:** conforme (`evidencias/F/auditoria.md`).

## 6. O que deu errado ou ficou diferente do planejado
- **F03 sem RED:** o teste passou de primeira, porque a F01 já filtrava removidos. Validei por mutação (filtro removido, teste falhou; restaurado).
- **C2 sem RED:** o `findActiveById` do TypeORM entrou na F01 para o build compilar. Mesma validação por mutação, com 2 testes falhando.
- **Erro provisório na F01:** o serviço lançou um `Error` genérico até a F02 trocá-lo por `ProductNotFoundException`.
- **CA09 parcial:** sem `.http` executável para CA04 (exigiria `UPDATE` no banco de desenvolvimento) e CA06 (o `500` não é provocável sem derrubar o banco).
- **Erro do assistente no commit:** meu `git add prompts` incluiu a movimentação de `uc-listar*.md` feita pelo estudante. Desfiz com `reset --soft` e a movimentação foi commitada à parte, com a autorização dele.
- **Erro do assistente em `00`:** marquei os arquivos `m00-*` como não verificados antes de listar a pasta; corrigi depois de conferir que existem (conteúdo não lido).

## 7. Autorizações que afetaram o ambiente do estudante
- Criação de issues, rótulo `uc14`, vínculo ao Epic e itens no Project #6 (autorizado com "Crie tudo").
- `docker compose up -d --build api`: recriou só a API.
- `run-checks.sh` no banco de desenvolvimento: 2 `POST /products` de teste. Nenhuma migration aplicada ou revertida.
- Testes de integração e e2e contra `postgres_test`.
- Renomeei a branch local (sem push) de `docs/uc14-buscar-produto` para `feature/uc14-buscar-produto`.
- Push da branch e abertura do PR #138, ao final, com autorização do estudante. Não houve merge, fechamento de issue, remoção de branch ou worktree.

## 8. Resultados verificados
| Verificação | Resultado |
|---|---|
| Linha de base (antes de mexer) | `pnpm test`: 47 passam, 4 falham (`orders`, ADR-001); build e lint ok |
| `pnpm test` final | 59 passam, 4 falham (as mesmas de `orders`) |
| `pnpm test:integration` | 15 de 15 |
| `pnpm test:e2e` | 10 passam, 1 falha (`orders`, conhecida) |
| `pnpm build` / `pnpm lint` | exit 0 / exit 0 (17 avisos anteriores) |
| `run-checks.sh` no contêiner | 36 ok, 0 falha |
| `check-state.sh --remote` e `check-links.mjs` | válidos |
| CI do PR #138 (commit `63ac179`) | Qualidade, Integração e E2E, Smoke do Docker Compose (inclui `run-checks.sh`) e GitGuardian: todos `pass` |

## 9. O que ainda não tem prova
CI na branch principal (o CI do PR #138 passou, ver item 8); produto removido no contêiner; falha `500` real via HTTP. Gates das Fases B a F, ainda `pendente`.

## 10. O que aconteceu além do prompt
Commit da movimentação de `uc-listar*.md` para `prompts/uc-13/`; criação de `docs/uc/uc14/README.md`; atualização do índice `13-02-estrutura-colecao.md`; uso do `state.yaml` e dos playbooks do método, que o prompt cita como opcionais.

## 11. Onde está tudo
- **Branch:** `feature/uc14-buscar-produto`, com push feito e **PR #138** aberto contra `main` (autorizado pelo estudante ao final do fluxo).
- **GitHub:** issues #126 a #137 e Project #6 (existem no remoto).
- **Documentos:** `prompts/` (UC, 00, 01, 03 e este resumo) e `docs/uc/uc14/` (state, contrato, README, roteiro, relatórios A e F, evidências A, B, E, F).
- **Código:** `src/` e `test/`; `.http` em `http-rest-client/`.

## 12. O que ficou pendente
CI, merge, fechamento das issues e do Epic, aprovação dos gates e `fase_atual: concluido` (ver `docs/uc/uc14/roteiro-conclusao-uc14.md`). Outras entidades (ex.: `Order`) ou operações viram **novas execuções** do prompt.

## Próximo passo
Acompanhar o CI do PR #138, revisar e decidir sobre o merge.

## Perguntas em aberto
Nenhuma crítica. Aguardo suas instruções sobre o merge.
