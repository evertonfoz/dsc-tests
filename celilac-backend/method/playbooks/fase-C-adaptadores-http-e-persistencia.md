# Playbook — Fase C: Adaptadores (HTTP e persistência)

> Procedimento curto e sem dados de projeto. Nomes, comandos, portas e variáveis vêm de `project-profile.md` e de `docs/uc/<uc>/state.yaml`. Regras permanentes: `method/AGENTS.md`. Divisão B/C: `method/decisoes/ADR-003-fatia-fases-b-c-e-arquetipos.md`.

| Campo | Valor |
|---|---|
| Camada | 1 (Ciclo do UC) |
| Fase | C — C1 fronteira HTTP · C2 persistência real |
| Arquétipos | criar *(validado)* · demais *(esboços, ver `matriz-arquetipos.md`)* |
| Depende de | Fase B aprovada; Fundação (banco de testes, CI) |
| Valida-se com | testes do adaptador · `pnpm test:integration` (banco de **testes**) · CI · revisão humana |

## 1. Objetivo
Expor o núcleo já provado pela **fronteira HTTP** (C1) e fazê-lo **persistir em banco real** (C2), em **um PR por adaptador**, cobrindo todas as fatias integradas. Os contratos do núcleo (entidade, porta do repositório, assinatura do serviço) **não mudam**.

## 2. Entradas
### 2.1. Já no repositório (não perguntar)
- `project-profile.md` (stack, comandos, variáveis do banco de testes, estrutura de código) e `state.yaml`.
- Relatório da Fase B e os testes das fatias.
### 2.2. A perguntar (somente se faltar)
- **Rota, status e formato de erro desejados**, se o UC não os define — *são decisões de contrato: registre como proposta e confirme (regra 7)*.
- **Esquema/tabela e restrições** (únicos, nulos, tamanhos), se o UC não os define — *definem a migration*.
- **Ordem:** C1 antes de C2 (padrão) ou o inverso — *C1 primeiro mantém a persistência em memória enquanto o contrato HTTP se estabiliza*.

## 3. Gate de entrada
- [ ] Fase B com gate aprovado por pessoa; `check-state.sh --remote` sem erros.
- [ ] Para C2: banco de testes no ar e variáveis de proteção do perfil definidas (`TEST_DB_*`, variável de permissão); `bash scripts/verify.sh --completo` (ou equivalente) verde antes de começar.
- [ ] Issue de cada adaptador (formulário de fase) com objetivo e gate.

## 4. Passos
### C1 — Fronteira HTTP (um PR)
1. **Branch** `feature/<uc>-c1-...` (ou a convenção do perfil) e issue própria.
2. **RED:** testes da fronteira (controller com serviço substituído) para cada fatia: sucesso, entrada inválida (o serviço **não** é chamado), erro de negócio mapeado ao status. — evidência: `docs/uc/<uc>/evidencias/C/c1-red.txt`.
3. **GREEN:** controller, DTO de entrada com validação, mapeamento de erros; o serviço continua em memória. — evidência: `docs/uc/<uc>/evidencias/C/c1-green.txt`.
4. **Regressão** de toda a suíte rápida e **revisão humana** do PR.

### C2 — Persistência real (um PR)
5. **Branch** `feature/<uc>-c2-...` e issue própria. Mostrar o plano (entidade ORM, mapeador, migration) e **aguardar aprovação** antes de tocar o banco.
6. **Migration versionada** (nunca `synchronize` em produção). Conferir que ela roda em **banco novo** e no legado. — evidência: `docs/uc/<uc>/evidencias/C/c2-migration.txt`.
7. **RED** de integração contra o banco de **testes** (gravar e reler, restrições, falha de infraestrutura). Respeitar as travas do perfil; **nunca** o banco de desenvolvimento. — evidência: `docs/uc/<uc>/evidencias/C/c2-red.txt`.
8. **GREEN:** adaptador do repositório, mapeador entidade↔domínio, ligação por injeção. — evidência: `docs/uc/<uc>/evidencias/C/c2-green.txt`.
9. **Regressão:** suíte rápida, integração e E2E; as falhas conhecidas (ADR do projeto) continuam sendo as mesmas, nenhuma nova.

Ao fim: **relatório da Fase C** (`relatorio-de-fase.md`), `state.yaml` atualizado, `check-links.mjs`. Mostrar o gate de saída e **aguardar validação**.

> Pare e pergunte antes de qualquer ação destrutiva (regra 8): `down -v`, `DROP`, `TRUNCATE`, `migration:revert`, apagar volumes. Migration em banco de desenvolvimento só com autorização.

## 5. Artefatos
| Artefato | Local | Obrigatório |
|---|---|---|
| PR de C1 e PR de C2 | GitHub | sim |
| Migration | diretório de migrations do perfil | sim (C2) |
| Evidências | `docs/uc/<uc>/evidencias/C/` | sim |
| Relatório da fase | `docs/uc/<uc>/relatorios/C.md` | sim |
| ADR | `docs/adr/` | se houve decisão de contrato ou de modelagem |

## 6. Gate de saída
| Verificação | Como | Quem valida |
|---|---|---|
| Cada fatia tem teste na fronteira HTTP | relatório C + testes | pessoa responsável |
| Dados gravados são relidos do banco de testes | `pnpm test:integration` | CI / pessoa |
| Migration aplica em banco novo e em banco com histórico | `docs/uc/<uc>/evidencias/C/c2-migration.txt` | pessoa responsável |
| Contratos do núcleo preservados | diff de entidade, porta e serviço | pessoa responsável |
| CI verde na principal | CI | CI |

O agente **não** marca `aprovado` nem faz merge (regras 9 e 21).

## 7. Proibições da fase
- Testes que gravam dados contra o banco de desenvolvimento; desligar as travas do perfil.
- `synchronize: true` fora de testes descartáveis; migration editada depois de aplicada.
- Alterar regra de negócio no adaptador (a regra pertence ao núcleo).
- Misturar C1 e C2 no mesmo PR; expor a entidade do domínio como resposta (isso é a Fase D).
- Afirmar "persiste" sem ler de volta do banco.

## 8. Variações por arquétipo
| Arquétipo | O que muda nesta fase | Validação |
|---|---|---|
| criar | `POST`, 201/400 (e 409 se houver unicidade); gravar e reler | validado (UC12) |
| consultar | `GET`, 200/404, filtros e paginação; índices | validado (UC13, UC14) |
| atualizar | `PUT`/`PATCH`, 200/404/409; concorrência | validado (UC15) |
| excluir | `DELETE`, 204/404; remoção física ou lógica; integridade referencial | esboço |
| autenticar | login 200/401 sem vazar detalhes; armazenamento seguro de credenciais | esboço |

## 9. Erros comuns
- Teste de integração em banco "sujo" → dados de outra execução → isolar por teste ou limpar só o que o teste criou, no banco de testes.
- Migration que só funciona no seu banco → dependência implícita (extensão, esquema) → rodar em banco novo.
- Status HTTP inventado → UC não define → registrar como proposta e confirmar.
- Validação duplicada (DTO e serviço divergem) → regra em dois lugares → manter a regra no núcleo e o formato no DTO.

## 10. Para o estudante
- **O que esta fase ensina:** adaptadores (portas e adaptadores) e provas diferentes para fronteiras diferentes.
- **Pergunte-se:** (1) o que prova que o dado foi *gravado*, e não só aceito? (2) o que acontece se eu rodar a migration num banco vazio? (3) a regra de negócio mudou de lugar?
- **Documento didático relacionado:** `method/didatico/05-as-seis-fases-e-seus-playbooks.md`.
