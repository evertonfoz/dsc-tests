---
id: apoio-a
tipo: apoio
titulo: 'Apoio A — GitHub além do básico'
ordem: 3
prerequisitos: []
duracao: '1 aula'
---

# Apoio A — GitHub além do básico

> **Para quem:** quem usa Git e GitHub para guardar código, mas ainda não usa issues, pull requests em rascunho e quadros de acompanhamento. Duração sugerida: 1 aula.
> **Pré-requisito:** saber fazer commit, push e abrir uma branch.
> **Você vai:** saber ligar cada mudança de código a uma razão registrada, sem depender de memória.

---

## 1. O problema
Seis meses depois, alguém abre uma linha do código e pergunta: **por que isto existe? quem pediu? foi testado? em que ponto do trabalho entrou?** Se a resposta depende de "lembro que foi numa conversa", o projeto não tem rastro.

No caso de referência (o projeto CeliLac), parte do rastro se perdeu: três materiais finais não tinham issue própria, um pull request citava issues de outro assunto, e a issue principal foi fechada em lote no último dia. Isso está registrado no módulo 2.

## 2. Antes de ler a solução
No seu projeto de qualquer disciplina, escolha uma linha de código e tente responder: por que ela existe, quem a pediu e que teste a protege. Anote quanto tempo levou e onde teve de adivinhar.

## 3. Os cinco recursos que resolvem isso

| Recurso | Para que serve | Exemplo neste curso |
|---|---|---|
| **Issue** | Registro de **uma** unidade de trabalho: o que fazer e quando está pronto | a issue #24: "rejeitar nome vazio no serviço" |
| **Branch** (ramo) | Cópia de trabalho isolada, para não mexer na linha principal (`main`) | `feature/uc12-f03-nome-vazio-no-nucleo` |
| **Pull request** (PR) | Proposta de integrar uma branch à `main`, com revisão e verificações automáticas | PR #26 |
| **Draft** (rascunho) | PR ainda em andamento, que não deve ser integrado | aberto cedo, para mostrar o trabalho |
| **Project** (quadro) | Visão em colunas do que está a fazer, em andamento e feito | o Project #6 |

Mais três hábitos que dão o rastro:
1. **Referência no commit.** A mensagem termina com `(refs #24)`: liga o commit à issue. Neste projeto **não** usamos palavras como "closes", que fecham a issue sozinhas; fechar é decisão de uma pessoa.
2. **Uma branch, uma issue, um PR.** Quem lê o PR sabe por que ele existe.
3. **Fechar issue só com PR integrado e o link da evidência no comentário.**

## 4. A ferramenta de linha de comando `gh`
`gh` é o programa que fala com o GitHub pelo terminal (CLI, *Command-Line Interface*, interface de linha de comando). Alguns comandos usados neste curso, todos de **leitura**:

| Comando | O que mostra |
|---|---|
| `gh issue list --state all` | todas as issues, abertas e fechadas |
| `gh pr view 26` | os dados do PR 26 |
| `gh pr checks 26` | as verificações automáticas do PR 26 (veja o apoio C) |

Autentique-se uma vez com `gh auth login` e confira com `gh auth status`.

## 5. Pratique no seu domínio
1. Crie um repositório (ou use o do seu projeto) e escreva **uma issue** para o seu caso de uso, com: objetivo, critérios de aceite (o que precisa ser verdade para estar pronto) e fora do escopo.
2. Crie uma **branch** com o número da issue no nome.
3. Faça um commit pequeno com `(refs #N)` na mensagem e abra um **PR em rascunho**.
4. Confira no GitHub que a issue mostra a menção do commit.

## 6. Como saber que funcionou
- [ ] Do PR chego à issue e da issue chego ao PR.
- [ ] Sei dizer por que uma linha qualquer do PR existe.
- [ ] Nenhuma issue foi fechada automaticamente por palavra-chave.

## 7. Armadilhas comuns
- Abrir uma issue por camada técnica ("fazer o DTO", "fazer o controller"). O módulo 3 mostra por que isso causa problemas.
- Reusar uma issue já fechada para um trabalho novo: abra outra.
- Esquecer de mover o card no Project: o quadro vira ficção.

## 8. Como lidar com a IA (inteligência artificial) aqui
A IA pode **redigir** o texto da issue e a mensagem do commit. Confira se o que ela escreveu **diz o que você de fato decidiu**, e nunca peça que ela feche issues ou integre PRs: isso é decisão de quem responde pelo trabalho.

Próximo: módulo 2, `m02-estado-como-fonte.md`.
