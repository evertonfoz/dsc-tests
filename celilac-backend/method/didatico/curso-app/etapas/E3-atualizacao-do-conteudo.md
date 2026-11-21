# E3 — Atualização do repositório de conteúdo

> Etapa E3 do plano da aplicação web do curso. Situação: **parte 1 concluída (PRs #73 a #76, integrados em 2026-11-21); parte 2 aguardando a aplicação em execução**.
> **Registro retroativo**, escrito em 2026-11-21, na sessão da E5. A parte 1 foi executada sem este documento; o prompt pede um documento por etapa, e a falta foi apontada pelo professor. Este texto **não traz decisão nova**: consolida o que está no `estado.md` e nos PRs, conferidos com `gh pr view` e `gh pr checks` nesta sessão.
> Convenção: **[Fato]** lido no repositório ou no GitHub; **[Recomendação]** proposta minha; **[Suposição]** a confirmar.

---

## 1. Por que a E3 existe
A E2 (seção 10) listou o que o conteúdo precisava ganhar para a aplicação funcionar: títulos de seção reconhecíveis, front matter, modelo de caso de uso, arquivos de prática, texto dos gabaritos e trechos que pressupõem professor. O professor dividiu a etapa em duas partes (decisão registrada no `estado.md`):
- **Parte 1:** o mínimo para a aplicação ler o curso e demonstrar um passo de prática.
- **Parte 2:** o restante, **depois de ver a aplicação em execução**.

Delegação registrada: a IA pôde abrir branches e PRs da parte 1 e fazer o merge, **só com o CI verde**. Apagar branches não foi autorizado.

## 2. Parte 1: o que foi integrado

[Fato] Dados de `gh pr view` e `gh pr checks`. Nos quatro PRs, as quatro verificações passaram: GitGuardian, "Qualidade (lint, build, testes rápidos, método)", "Integração e E2E (PostgreSQL de testes)" e "Smoke do Docker Compose".

| PR | Assunto | Branch | Commit de merge | Arquivos | Muda o que o aluno lê? |
|---|---|---|---|---|---|
| [#73](https://github.com/evertonfoz/dsc-tests/pull/73) | Título da prática do apoio B | `docs/curso-titulo-pratica-apoio-b` | `cd552c4` | 2 (`apoio-b-testes-e-tdd.md`, `estado.md`) | Só o título | <!-- links:ignore -->
| [#74](https://github.com/evertonfoz/dsc-tests/pull/74) | Front matter nos arquivos do curso | `docs/curso-front-matter` | `326be20` | 33 (32 do curso e o `estado.md`) | Não; o GitHub mostra o bloco como tabela | <!-- links:ignore -->
| [#75](https://github.com/evertonfoz/dsc-tests/pull/75) | Modelo do documento de caso de uso | `docs/modelo-caso-de-uso` | `0aca41a` | 3 (`method/templates/caso-de-uso.md`, `method/README.md`, `estado.md`) | Não ainda; nenhum módulo cita o modelo | <!-- links:ignore -->
| [#76](https://github.com/evertonfoz/dsc-tests/pull/76) | Prática piloto do m02 | `docs/curso-pratica-m02` | `ab0b997` | 3 (`m02-pratica.md`, `m02-estado-como-fonte.md`, `estado.md`) | Sim: arquivo novo e uma linha no m02 | <!-- links:ignore -->

### 2.1. Diferenças em relação ao que a E2 propôs
| Item da E2 | O que foi feito | Motivo |
|---|---|---|
| Seção 10, item 1: uniformizar todos os títulos de seção | Só o apoio B mudou | As quatro seções que a aplicação usa já eram reconhecíveis pelo início do título em todos os arquivos; o gerador reconhece pelo prefixo |
| Seção 3: front matter | Dois campos a mais: `prerequisitos_se_precisar` (m01 e projeto final) e `gabarito_de` (gabaritos); `pratica` só onde o arquivo existe | Registrar o pré-requisito condicional do m01 sem mudar o texto e ligar gabarito ao módulo nos dois sentidos |
| Seção 3: front matter em 33 arquivos | 32 arquivos | O `README.md` do curso é o índice e ficou sem front matter |

### 2.2. O que foi executado e o que não foi
- [Fato] As saídas esperadas dos passos 3 e 4 do `m02-pratica.md` foram obtidas rodando `check-state.sh` sobre o modelo preenchido com valores de exemplo (OK com saída 0; 5 erros com saída 1).
- [Fato] As mensagens do passo 5 (`--remote`) foram tiradas do código de `method/scripts/check-state.mjs`, **sem execução** contra um repositório.
- [Fato] As referências de linha da E2, seção 9, valem para o commit `9e47c34`; o front matter deslocou as linhas.

## 3. Inconsistências encontradas e não corrigidas
Registradas no `estado.md`, seção "Pendências e divergências":
1. `m04-gabarito.md` cobre o apoio D, mas o `README.md` do curso diz que o apoio D não tem gabarito.
2. O m01 pede o apoio B "se você ainda não escreveu um teste", mas a sequência "Próximo:" só chega ao apoio B depois do m02. Tratado no front matter como pré-requisito condicional; o texto não mudou.
3. `projeto-final.md` diz "individual ou em dupla"; a decisão P6 diz equipes de 2 ou mais (encontrada na E4; troca aprovada para a parte 2).

## 4. Parte 2: o que falta (depois de ver a aplicação em execução)
| # | Assunto | Origem | Depende de decisão do professor |
|---|---|---|---|
| 1 | 16 arquivos de prática restantes (dos 17; o m02 já existe), começando pelos do mínimo útil da E7 | E2, seções 5 e 10 | Ordem e escopo |
| 2 | Reescrita dos 14 gabaritos para autoestudo (opção c) | E2, seção 8 | **Sim** (rubrica e texto, prompt seção 5, item 5) |
| 3 | Textos que pressupõem professor ou colega | E2, seção 9 | Aceito na E2; revisão do texto final |
| 4 | Corrigir o `README.md` do curso sobre o gabarito do apoio D | seção 3, item 1 | **Sim** |
| 5 | "em dupla" → "em equipe" no `projeto-final.md` | E4, seção 8 | Aprovado |
| 6 | Citar `method/templates/caso-de-uso.md` no m00 (prática, passo 2) | `estado.md` | Entra com o arquivo de prática do m00 |
| 7 | Conteúdo do kit que a E5 decidir colocar no repositório de conteúdo | E5 | Conforme a validação da E5 |

**Etapas que a parte 1 pode ter invalidado:** nenhuma. Os PRs aplicaram o que a E2 aprovou, com as diferenças da seção 2.1, que não mudam o pipeline: o gerador continua lendo títulos pelo prefixo e o front matter pelo formato da E2, seção 3.

---

## Fechamento

**O que foi feito:** este registro retroativo da E3, a partir do `estado.md` e dos dados dos PRs #73 a #76 conferidos no GitHub nesta sessão.

**O que não foi verificado:** não reli o diff completo de cada PR; a descrição de conteúdo vem do `estado.md` e da lista de arquivos de cada PR. Não rodei de novo `check-links.mjs` sobre o estado de cada PR.

**O que você precisa decidir:** se este registro está correto e completo para a parte 1. A parte 2 só começa depois da aplicação em execução, como já decidido.
