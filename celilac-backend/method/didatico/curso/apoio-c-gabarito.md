---
id: apoio-c-gabarito
tipo: gabarito
titulo: 'Gabarito para autoestudo — Apoio C'
gabarito_de: [apoio-c]
---

# Gabarito para autoestudo — Apoio C

> Este gabarito é público. Tente primeiro a atividade no seu projeto e use as respostas para comparar o raciocínio. Isso é orientação de estudo, não bloqueio; resultados do CeliLac são referência documentada, não execução no seu projeto.

## Atividade da seção 2
Respostas variam. O objetivo é perceber que a lista de passos é longa, que alguns dependem do seu computador e que outra pessoa não conhece o que você fez. Compare com sua lista real: uma resposta honesta identifica passos que dependem do computador; “faço tudo sempre” não revela essas dependências.

## Raciocínio para conferir
1. O que o robô garante que a pessoa não garante? (mesmo ambiente, sempre, com registro)
2. O que o robô **não** garante? (que existe teste para a regra; que o teste é bom; que o requisito está correto)
3. Por que a senha do banco no job pode estar no arquivo, e a senha real não? (o banco é descartável e inacessível de fora)
4. Quando é aceitável excluir um teste do CI? (só com registro explícito e motivo, como a ADR-001)

## Verificação da prática
Para conferir sua prática, localize o endereço de um PR com o job verde, outro com o job vermelho (com o erro lido) e o commit que o consertou.

## Autoavaliação sugerida
| Critério | Peso sugerido |
|---|---|
| Fluxo roda a cada PR e fica verde | 30% |
| Falha provocada e explicada pela mensagem do robô | 30% |
| Passos de lint e build acrescentados | 20% |
| Nenhum segredo real no repositório | 20% |

## Limites do exemplo
O fluxo mostrado é de uma stack Node/NestJS com pnpm; quem usa outra linguagem adapta os comandos, mantendo a estrutura (`on`, `jobs`, `steps`).
