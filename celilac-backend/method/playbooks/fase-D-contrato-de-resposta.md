# Playbook — Fase D: Contrato de resposta

> Procedimento curto e sem dados de projeto. Nomes, comandos e rotas vêm de `project-profile.md` e de `docs/uc/<uc>/state.yaml`. Regras permanentes: `method/AGENTS.md`.

| Campo | Valor |
|---|---|
| Camada | 1 (Ciclo do UC) |
| Fase | D — Contrato de resposta |
| Arquétipos | criar *(validado)* · demais *(esboços, ver `matriz-arquetipos.md`; peso maior em consultar e autenticar)* |
| Depende de | Fase C aprovada (C1 e C2 integradas) |
| Valida-se com | testes de contrato (HTTP) · CI · revisão humana |

## 1. Objetivo
Fixar e provar **o que a API devolve**: formato, campos, códigos de status e mensagens de erro, de modo que a entidade interna e os detalhes de persistência **nunca** vazem na resposta. Ao final, o contrato está escrito e coberto por testes que quebram se ele mudar.

## 2. Entradas
### 2.1. Já no repositório (não perguntar)
- `project-profile.md`, `state.yaml`, relatórios B e C e os testes de fronteira da Fase C.
- O documento do UC (campo `documento` do `state.yaml`) para saber o que a resposta deve conter.
### 2.2. A perguntar (somente se faltar)
- **Campos públicos da resposta e formato dos erros**, se o UC não os define — *decisão de contrato: registre como proposta e confirme (regra 7)*.
- **Campos que nunca podem sair** (ex.: dados internos, credenciais) — *base do teste de não exposição*.

## 3. Gate de entrada
- [ ] Fase C com gate aprovado por pessoa; `check-state.sh --remote` sem erros.
- [ ] CI verde na principal e `bash scripts/verify.sh` verde localmente.
- [ ] Levantamento do comportamento **atual** da API (o que ela devolve hoje), registrado como fato.

## 4. Passos
1. **Inventário do contrato atual** — para cada rota do UC, status e corpo reais, obtidos executando a API ou os testes (não por leitura de código apenas). — evidência: `docs/uc/<uc>/evidencias/D/contrato-atual.md`.
2. **Comparar com o UC** e listar divergências (campo faltando, sobrando, status diferente). Cada divergência vira: correção, ou ADR de decisão (aceitar como está).
3. **Definir o contrato** (DTO de resposta, formato de erro, status por situação) e escrevê-lo em um documento curto (`docs/uc/<uc>/contrato.md`). Apresentar e **aguardar aprovação** antes de alterar o código.
4. **RED:** testes de contrato — formato do sucesso, formato de cada erro, campos que **não** aparecem. — evidência: `docs/uc/<uc>/evidencias/D/red.txt`.
5. **GREEN:** DTO de resposta e mapeamento a partir da entidade; erros padronizados. Sem alterar regra de negócio. — evidência: `docs/uc/<uc>/evidencias/D/green.txt`.
6. **Regressão:** suíte rápida, integração e E2E; as mesmas falhas conhecidas, nenhuma nova.
7. **PR** (um por conjunto coeso de mudanças de contrato; separe correção de bug de mudança de contrato), revisão e merge **humanos**.

Ao fim: **relatório da Fase D**, `state.yaml` atualizado, `check-links.mjs`. Mostrar o gate de saída e **aguardar validação**.

> Mudança de contrato que quebra quem já consome a API exige ADR e aviso explícito à pessoa responsável (regra 8: irreversível para clientes).

## 5. Artefatos
| Artefato | Local | Obrigatório |
|---|---|---|
| Contrato (rotas, status, corpos, erros) | `docs/uc/<uc>/contrato.md` | sim |
| Testes de contrato | diretório de testes do perfil | sim |
| Evidências | `docs/uc/<uc>/evidencias/D/` | sim |
| Relatório da fase | `docs/uc/<uc>/relatorios/D.md` | sim |
| ADR | `docs/adr/` | se houve divergência aceita ou mudança incompatível |

## 6. Gate de saída
| Verificação | Como | Quem valida |
|---|---|---|
| Cada rota do UC tem sucesso e erros documentados e testados | `contrato.md` + testes | pessoa responsável |
| Campos internos não aparecem na resposta | teste de não exposição | CI / pessoa |
| Divergências com o UC resolvidas ou com ADR | relatório D | pessoa responsável |
| CI verde na principal | CI | CI |

O agente **não** marca `aprovado` nem faz merge (regras 9 e 21).

## 7. Proibições da fase
- Devolver a entidade de domínio ou de banco como corpo de resposta.
- Documentar o contrato por suposição, sem executar a API ou os testes.
- Mudar regra de negócio ou persistência (Fases B e C) dentro de um PR de contrato.
- Mensagens de erro que revelam detalhes internos (SQL, caminhos, pilha).

## 8. Variações por arquétipo
| Arquétipo | O que muda nesta fase | Validação |
|---|---|---|
| criar | DTO público no `201`; formato do `400` (e `409`) | validado (UC12) |
| consultar | **peso maior:** formato de lista, paginação, campos e ordenação | esboço |
| atualizar | resposta do sucesso e de conflito (`409`) | esboço |
| excluir | corpo costuma ser vazio (`204`); fase simplificada | esboço |
| autenticar | **peso maior:** o que nunca sai (hash, segredos); erro de login sem detalhe | esboço |

## 9. Erros comuns
- Contrato "descrito" sem ter sido executado → texto diverge da API → refazer o inventário rodando as rotas.
- Resposta com campo extra por acidente → entidade devolvida direto → mapear para DTO e testar a ausência.
- Mensagens de erro diferentes por rota → falta de padrão → definir um formato único de erro.

## 10. Para o estudante
- **O que esta fase ensina:** contrato como compromisso com quem consome a API e como proteger o que é interno.
- **Pergunte-se:** (1) que campo meu cliente jamais deve ver? Qual teste prova isso? (2) se eu renomear um campo, qual teste quebra? (3) o texto do contrato foi conferido contra a API em execução?
- **Documento didático relacionado:** `method/didatico/` (será o 05, ao fim da Etapa 5).
