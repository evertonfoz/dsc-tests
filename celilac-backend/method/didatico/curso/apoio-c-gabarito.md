---
id: apoio-c-gabarito
tipo: gabarito
titulo: 'Gabarito do professor — Apoio C'
gabarito_de: [apoio-c]
---

# Gabarito do professor — Apoio C

> Uso exclusivo do professor.

## Atividade da seção 2
Respostas variam. O objetivo é o aluno perceber que a lista de passos é longa, que alguns dependem do computador dele e que ninguém mais a conhece. Aceite qualquer lista honesta; descarte a que diz "faço tudo sempre".

## Pontos para discussão
1. O que o robô garante que a pessoa não garante? (mesmo ambiente, sempre, com registro)
2. O que o robô **não** garante? (que existe teste para a regra; que o teste é bom; que o requisito está correto)
3. Por que a senha do banco no job pode estar no arquivo, e a senha real não? (o banco é descartável e inacessível de fora)
4. Quando é aceitável excluir um teste do CI? (só com registro explícito e motivo, como a ADR-001)

## Verificação da prática
O aluno deve mostrar o endereço de um PR com o job verde, outro com o job vermelho (com o erro lido) e o commit que o consertou.

## Critérios de avaliação sugeridos
| Critério | Peso |
|---|---|
| Fluxo roda a cada PR e fica verde | 30% |
| Falha provocada e explicada pela mensagem do robô | 30% |
| Passos de lint e build acrescentados | 20% |
| Nenhum segredo real no repositório | 20% |

## Limites do exemplo
O fluxo mostrado é de uma stack Node/NestJS com pnpm; quem usa outra linguagem adapta os comandos, mantendo a estrutura (`on`, `jobs`, `steps`).
