---
id: m04-gabarito
tipo: gabarito
titulo: 'Gabarito do professor — Módulo 4 e Apoio D'
gabarito_de: [m04, apoio-d]
---

# Gabarito do professor — Módulo 4 e Apoio D

> Uso exclusivo do professor.

## Atividade da seção 2 (clone limpo)
Respostas variam; esperam-se, entre outras: arquivo `.env` ausente, versão diferente do Node ou do banco, dados pré-existentes na máquina, porta ocupada, comandos que só existem no histórico do terminal do autor. Valorize a lista honesta mais do que o "rodou de primeira".

## Pontos para discussão
1. Por que o ambiente limpo é o melhor juiz? (revela dependências ocultas)
2. O que as três travas do banco de testes protegem, e quando uma sozinha não bastaria? (ex.: nome terminando em `_test` mas apontando para o servidor errado; a variável explícita e a porta distinta cobrem isso)
3. Em que a Fundação difere de um "setup inicial"? (é versionada, verificada e reaproveitada por todos os casos de uso)
4. Quando é legítimo excluir testes do CI? (somente com ADR, motivo e lista única)

## Verificação da prática
O aluno mostra: (a) a saída do script de verificação; (b) a prova de que as travas abortam (saída do erro); (c) a execução em cópia limpa; (d) o link do PR de fundação com CI verde.

## Critérios de avaliação sugeridos
| Critério | Peso |
|---|---|
| Ordem de construção respeitada e PR só de fundação | 20% |
| Travas do banco de testes com prova de recusa | 30% |
| Script e CI com os mesmos passos | 20% |
| Validação em cópia limpa documentada | 20% |
| Nenhum segredo versionado | 10% |

## Apoio D
- Conferir que o `.env` está no `.gitignore` e o `.env.example` não tem segredos.
- Conferir que os dados sobrevivem a `docker compose stop` e novo `up`.
- Reforçar a regra do `-v`: pergunte "o que `down -v` apaga?".

## Limites do exemplo
Exige Docker instalado nos computadores dos alunos. Em máquinas sem Docker, use o laboratório da instituição ou um banco local, mantendo as três travas do banco de testes.
