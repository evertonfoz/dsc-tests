---
id: m02
tipo: modulo
titulo: 'Módulo 2 — Por que o plano e a realidade divergem?'
ordem: 4
prerequisitos: [m01, apoio-a]
duracao: '2 aulas'
gabarito: m02-gabarito
---

# Módulo 2 — Por que o plano e a realidade divergem?

> **Pré-requisito:** módulo 1 e o apoio A (`apoio-a-github-alem-do-basico.md`). Duração sugerida: 2 aulas.
> **Você vai:** criar um arquivo único que diz **em que ponto** está o seu caso de uso, e usar um programa para conferir se ele diz a verdade.

---

## 1. O problema
O planejamento do caso de uso UC12 (UC, *Use Case*: caso de uso) afirmava **6 sub-issues** (as tarefas filhas da issue principal). No GitHub existiam **9**: a persistência era a SUB-04, e não a SUB-03; os testes eram a SUB-07, e não a SUB-06; e duas sub-issues tinham sido acrescentadas depois. Números de issues, branches e pull requests (PR, a proposta de mudança no GitHub) estavam copiados em dezenas de arquivos Markdown, **cada um com a sua versão**.

Ninguém conseguia responder depressa: **em que fase estamos? quais partes já estão integradas? qual PR trouxe isto?**

## 2. Antes de ler a solução
Imagine que você entra hoje no projeto. Em 15 minutos, responda, usando só os documentos de planejamento:
1. Quantas sub-issues existem?
2. Quais já foram integradas e por qual PR?
3. Qual é o próximo passo?

Compare com o que o GitHub mostra (`gh issue list --state all`, do apoio A). Onde as respostas divergem?

## 3. A tentativa ingênua
**Atualizar todos os documentos a cada mudança.** Funciona na primeira semana. Depois alguém esquece um arquivo, e a mesma informação passa a existir em versões diferentes. O erro não é falta de disciplina: é **ter a mesma informação em muitos lugares**.

## 4. A solução: um lugar só
Cada caso de uso tem um arquivo `state.yaml` (YAML é um formato de texto para dados estruturados, fácil de ler e de validar por programa). Ele guarda os **fatos de rastreabilidade**: fase, fatias, issues, branches, PRs e evidências. Todos os outros documentos **apontam** para ele.

> Regra do método: se um documento e o `state.yaml` divergirem, **o `state.yaml` vence** e o documento é corrigido.

### 4.1. Dois arquivos, duas perguntas
| Arquivo | Responde | Muda quando |
|---|---|---|
| `project-profile.md` | **Como** este projeto funciona? (comandos, portas, versões) | raramente |
| `docs/uc/<uc>/state.yaml` | **Onde** este caso de uso está? | a cada fase e a cada fatia |

### 4.2. Anatomia (resumida)
```yaml
uc: UC12
nome: Cadastrar Produto
arquetipo: criar
epic: { issue: 23, estado: closed }
fase_atual: concluido
fases:
  A:
    status: concluida
    gate:
      - { item: "Todo item do UC mapeado", resultado: aprovado, por: evertonfoz }
fatias:
  - id: F03
    comportamento: "O serviço rejeita nome vazio no núcleo, sem gravar nada"
    criterios: [RN01, FA01, CA02]
    issue: 24
    branch: feature/uc12-f03-nome-vazio-no-nucleo
    pr: 26
    status: integrada
```
Quatro ideias:
1. **Fatia** é a unidade de trabalho (módulo 3): um comportamento, **uma** issue, **uma** branch, **um** PR.
2. **Gate** é uma condição verificável para considerar uma fase concluída. Ele só vale com `por:`, o nome de **quem validou**: uma pessoa ou o `CI` (integração contínua, o robô que roda verificações; apoio C).
3. **Evidências** são **caminhos de arquivos** que precisam existir.
4. Siglas como `RN01`, `FA01` e `CA02` são identificadores do documento do caso de uso: regra de negócio (RN), fluxo alternativo (FA) e critério de aceite (CA).

### 4.3. O ciclo de vida de uma fatia
```
planejada ──► em_andamento ──► em_revisao ──► integrada
 (sem issue)   (issue + branch)  (PR aberto)    (PR integrado, revisor, evidências)
```
Cada seta **exige campos novos**: uma fatia `integrada` sem PR, ou sem evidências, é um erro.

## 5. O validador: o arquivo é conferido por programa
O comando `method/scripts/check-state.sh docs/uc/<uc>/state.yaml` verifica, sem internet:
- campos obrigatórios e valores permitidos;
- coerência (não se está na fase C se a B não terminou);
- unicidade (nenhuma issue ou PR atribuído a duas fatias);
- existência dos arquivos de relatório e de evidência citados;
- gates aprovados com o nome de quem validou.

Com `--remote`, consulta o GitHub (somente leitura): a issue principal está aberta como o arquivo diz? Cada PR existe e foi integrado de fato?

> Ele já provou utilidade: avisou, durante o piloto, que uma fatia constava como integrada com a issue ainda aberta. A decisão de fechá-la ficou com uma pessoa.

## 6. Pratique no seu domínio
1. Copie o modelo `method/templates/state.yaml` para `docs/uc/<seu-uc>/state.yaml` (código do caso de uso em **minúsculas**, por exemplo `uc01`).
2. Preencha: nome, arquétipo (`criar`), a issue principal do módulo anterior, e **duas fatias** com `status: planejada`.
3. Rode `method/scripts/check-state.sh` e leia **cada mensagem** que ele imprimir.
4. **Quebre de propósito**: marque uma fatia como `integrada` sem PR. Rode de novo e leia o erro. Desfaça.
5. Rode com `--remote` e veja o que o GitHub confirma ou contradiz.

## 7. Como saber que funcionou
- [ ] O validador termina com "OK" sem erros.
- [ ] Alguém que nunca viu seu projeto responde, só lendo o arquivo, em que fase está e o que falta.
- [ ] Nenhum número de issue ou PR está copiado em outro documento sem apontar para o `state.yaml`.

## 8. Armadilhas comuns
- **Marcar `aprovado` sem `por:`** ou com o nome de quem não validou.
- **Atualizar o arquivo só no fim.** Atualize a cada fase e a cada fatia.
- **Colocar no `state.yaml` o que é opinião** ("ficou ótimo"). Ele guarda fatos conferíveis.
- **Maiúsculas no nome da pasta.** Use sempre o código do UC em minúsculas.

## 9. Como lidar com a IA (inteligência artificial) neste módulo
A IA pode **preencher** o arquivo a partir do que você disser. Duas regras:
1. **Rode o validador você mesmo.** "Está válido" dito por ela não vale; a saída do comando vale.
2. **Nunca deixe a IA marcar um gate de pessoa como `aprovado`.** Gates objetivos (CI verde) podem constar como `por: CI`; os que pedem julgamento são seus.

Próximo: apoio B, depois o módulo 3.
