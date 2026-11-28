# 04 — Fundação do projeto: o que se resolve uma vez, antes dos casos de uso

> **Público:** estudantes e quem for adotar o método em outro repositório.
> **Objetivo:** entender por que ambiente, CI e salvaguardas de teste ficam fora do caso de uso, o que foi construído na Fundação do CeliLac e quais erros apareceram no caminho.
> **Pré-requisitos:** documentos 01 a 03.

---

## 1. Por que separar a Fundação do caso de uso

No UC12 original, Docker, banco de testes, CI e coleção HTTP nasceram dentro do próprio caso de uso. O resultado: o primeiro UC carregava trabalho que não era dele, e o segundo UC não teria como saber se o ambiente já estava pronto. No método, isso é a **Camada 0**: feita **uma vez por repositório**, com issue e PR próprios (`chore/<resumo>`), e só depois começa o ciclo A–F.

| Pergunta | Fundação (Camada 0) | Caso de uso (Camada 1) |
|---|---|---|
| Quantas vezes? | Uma por repositório | Uma por UC |
| Exemplo | CI, Compose, banco de testes, `verify.sh` | Cadastrar produto |
| Branch | `chore/<resumo>` | `feature/<uc>-<fatia>-...`, `docs/<uc>-fase-<letra>-...` |
| Gate | CI verde e revisão humana | Gates das fases A–F no `state.yaml` |

## 2. O que a Fundação do CeliLac entregou

1. **Compose sem senhas padrão.** `compose.yaml` exige as variáveis (`${VAR:?mensagem}`); o `.env.example` traz só valores de exemplo sem segredo.
2. **Isolamento dos testes que gravam dados.** Integração e E2E rodam contra `postgres_test`. Três travas: `TEST_DB_ALLOW_DESTRUCTIVE=true`, nome do banco terminado em `_test` e usuário/porta distintos dos de desenvolvimento. O teste `test/database-isolation.e2e-spec.ts` é a guarda permanente. <!-- links:ignore -->
3. **Migration `EnableUuidOssp`.** Um banco novo não conseguia criar pedidos porque faltava a extensão `uuid-ossp`. Foi verificado em banco novo e em banco legado.
4. **CI** (`.github/workflows/celilac-backend-ci.yml`) com três jobs: qualidade, integração/E2E com PostgreSQL de serviço, e *smoke* do Compose com senhas efêmeras. <!-- links:ignore -->
5. **Validadores de documentos:** `check-state` (estado) e `check-links` (links e caminhos citados existem, regra 19 do `AGENTS.md`).
6. **Templates do GitHub:** formulários de issue de fatia e de fase, e modelo de PR.
7. **`scripts/verify.sh`:** a mesma verificação do CI, rodável localmente (rápida, ou `--completo` com banco). <!-- links:ignore -->
8. **Falhas conhecidas com dono:** o exercício didático de `orders` tem 5 testes que falham de propósito. Em vez de ocultá-los, a ADR-001 do projeto registra a decisão e `scripts/known-failures.env` guarda a lista num único lugar, lido pelo CI e pelo `verify.sh`. <!-- links:ignore -->

## 3. Lições (com os erros que as originaram)

- **Prove o que o ambiente limpo faz.** O CI falhou porque `method/exemplos/` era uma pasta vazia: o Git não versiona pasta vazia, e a máquina local escondia isso. Validamos agora também em cópia limpa (`git archive`). *Lição: "funciona na minha máquina" não é evidência.* <!-- links:ignore -->
- **Uma lista, um lugar.** A lista de falhas conhecidas estava duplicada no workflow. Ao centralizar, apareceu um bug: o filtro `[A-Z]+` não casava `KNOWN_FAILURES_E2E` (tem dígito). Foi pego na simulação local, antes de ir ao CI. *Lição: simule o passo do CI antes do push.*
- **Erro de sintaxe também é falha de CI.** Um `: ` dentro de um nome de passo sem aspas invalidou o workflow inteiro. *Lição: valide o YAML antes de enviar.*
- **Falha não reproduzida não é falha resolvida.** Uma execução inicial do E2E mostrou 2 falhas; uma não foi capturada e não voltou em mais de 9 execuções. Ficou registrada como "não reproduzida", e não como "corrigida".
- **Falha conhecida precisa de decisão.** Excluir testes que falham sem registro é esconder problema; com ADR, lista única e exclusão só no CI, quem roda `pnpm test` localmente continua vendo o exercício.
- **Proibições valem para o agente também.** Nada de `down -v`, `DROP`, `TRUNCATE` ou `migration:revert` sem autorização; o `verify.sh` não usa nenhum deles.

## 4. Como replicar no seu projeto
1. Preencha o `project-profile.md` a partir do `method/templates/project-profile.md` e do perfil de stack.
2. Abra uma issue de fundação e uma branch `chore/<resumo>`.
3. Faça, nesta ordem: Compose sem segredos, banco de testes com as três travas, `verify.sh`, CI, templates do GitHub.
4. Valide em cópia limpa e só então peça revisão. O merge é humano.
5. Só depois abra o primeiro caso de uso.

## 5. Exercícios
1. Liste três coisas do seu projeto que hoje estão dentro de um caso de uso mas pertencem à Fundação.
2. Por que o `verify.sh` e o CI devem executar os mesmos passos? O que acontece quando divergem?
3. A trava `_test` no nome do banco protege de quê? Dê um cenário em que as outras duas travas ainda seriam necessárias.
4. Escreva a ADR de uma falha conhecida do seu projeto: contexto, decisão, onde a lista mora e quando ela deve ser removida.

## 6. Referências
- `project-profile.md` · `method/perfis/celilac-nest.md`
- `docs/adr/ADR-001-falhas-conhecidas-exercicio-orders.md` (CeliLac, no repositório do curso) <!-- links:ignore -->
- `scripts/verify.sh` · `scripts/known-failures.env` (CeliLac, no repositório do curso) <!-- links:ignore -->
- `.github/workflows/celilac-backend-ci.yml` (CeliLac, no repositório do curso) <!-- links:ignore -->

Próximo documento: **05 — Playbooks das fases** (Etapa 5).
