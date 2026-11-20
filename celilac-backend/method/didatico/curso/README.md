# Curso: implementando um caso de uso com evidência

> **Público:** estudantes de Ciência da Computação com conhecimento básico a intermediário de Git e GitHub. **Não** se supõe conhecimento de integração contínua (CI), Docker ou testes automatizados além do básico: eles são ensinados nos módulos de apoio.
> **Formato:** cada módulo começa por um **problema real**, tenta primeiro a solução ingênua, mostra por que ela falha e só então apresenta a solução do método.
> **Prática:** você aplica tudo ao **seu próprio domínio**. O CeliLac, projeto de referência, é o exemplo trabalhado.

## Como cada módulo é organizado
1. **O problema:** uma situação que aconteceu de verdade, com evidência no repositório.
2. **Antes de ler a solução:** uma atividade curta para você tentar sozinho.
3. **A tentativa ingênua** e por que ela falha.
4. **A solução do método**, passo a passo.
5. **Pratique no seu domínio.**
6. **Como saber que funcionou** (verificação).
7. **Armadilhas comuns** e **como lidar com a IA** neste ponto.

Cada módulo tem um arquivo de **gabarito para o professor**, à parte.

## Mapa dos módulos

| Módulo | Pergunta que abre o módulo | Estado |
|---|---|---|
| Apoio A | O que há no GitHub além do básico (issues, PRs, Project, labels)? | a escrever |
| Apoio B | O que é um teste automatizado e o que é TDD? | a escrever |
| Apoio C | O que é integração contínua (CI) e por que ela existe? | a escrever |
| Apoio D | Por que usar contêineres (Docker e Compose)? | a escrever |
| **0** | O que significa um caso de uso estar "pronto"? | `m00-o-caso-pronto.md` |
| **1** | "100% coberto": quem prova? | `m01-cobertura-real.md` |
| 2 | Por que o plano e a realidade divergem? | a escrever |
| 3 | Por que a `main` ficou vermelha? | a escrever |
| 4 | Por que "na minha máquina funciona" não basta? | a escrever |
| 5 | Onde mora a regra de negócio? | a escrever |
| 6 | O que o cliente vê quando o banco falha? | a escrever |
| 7 | Seu teste prova alguma coisa? | a escrever |
| 8 | Como persistir de verdade? | a escrever |
| 9 | Alguém olhou o contrato real da API? | a escrever |
| 10 | E se uma fatia aparecer tarde demais? | a escrever |
| 11 | Outra pessoa consegue repetir sua verificação? | a escrever |
| 12 | Quem aprova, e o que a IA pode fazer? | a escrever |
| Projeto | Conduza um caso de uso seu do início ao fim | a escrever |

## O projeto do curso
Antes do módulo 1, escolha **um caso de uso do seu domínio** que:
- crie algo (cadastrar, registrar, enviar);
- tenha pelo menos uma regra de negócio (campo obrigatório, limite, unicidade);
- grave em banco de dados.

Esse será o seu caso de uso até o fim do curso. Cada módulo termina com uma tarefa aplicada a ele.

## Como estudar com IA neste curso
O curso pressupõe que você usará um assistente de IA. As regras abaixo valem para todos os módulos.
1. **Você é o responsável.** O que a IA entrega é hipótese até haver evidência: um teste que roda, uma saída de comando, um resultado de CI.
2. **Peça a prova, não a opinião.** "Está tudo coberto?" não é uma boa pergunta. "Liste cada requisito, o nome do teste que o prova e rode esse teste" é.
3. **Confira você mesmo** pelo menos uma amostra do que ela afirma. Se a amostra falhar, desconfie do resto.
4. **A IA não aprova nada.** Aprovar uma fase, fechar uma issue ou integrar um PR é decisão sua (ou de quem tem essa responsabilidade no seu grupo).
5. **Registre quando delegar.** Se você pedir que a IA revise algo no seu lugar, anote que foi revisão de IA. Ela não substitui uma revisão independente.
6. **Ela erra, e você também.** No piloto que originou este curso, a própria IA esqueceu de conferir o código de saída de um validador mais de uma vez; o CI pegou. A defesa é o processo, não a confiança.

## Material de consulta
- Visão geral do método: `method/README.md` e `method/glossario.md`.
- O piloto completo em forma de relato: `method/didatico/06-piloto-reconciliando-o-uc12.md`.
- O estado final do caso real: `docs/uc/uc12/state.yaml`.
