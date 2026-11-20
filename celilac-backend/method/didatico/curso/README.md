# Curso: implementando um caso de uso com evidência

> **Público:** estudantes de Ciência da Computação com conhecimento básico a intermediário de Git e GitHub. **Não** se supõe conhecimento de integração contínua (CI), Docker ou testes automatizados além do básico: eles são ensinados nos módulos de apoio.
> **Formato:** cada módulo começa por um **problema real**, tenta primeiro a solução ingênua, mostra por que ela falha e só então apresenta a solução do método.
> **Prática:** você aplica tudo ao **seu próprio domínio**. O CeliLac, projeto de referência, é o exemplo trabalhado.

## Regra de siglas
Toda sigla é explicada **na primeira vez em que aparece em cada módulo**, e todas estão reunidas no quadro "Siglas usadas no curso" no fim deste arquivo. Se encontrar uma sigla sem explicação, é uma falha do material: avise o professor.

## Como cada módulo é organizado
1. **O problema:** uma situação que aconteceu de verdade, com evidência no repositório.
2. **Antes de ler a solução:** uma atividade curta para você tentar sozinho.
3. **A tentativa ingênua** e por que ela falha.
4. **A solução do método**, passo a passo.
5. **Pratique no seu domínio.**
6. **Como saber que funcionou** (verificação).
7. **Armadilhas comuns** e **como lidar com a IA** (inteligência artificial, como os assistentes de código) neste ponto.

Cada módulo tem um arquivo de **gabarito para o professor**, à parte.

## Mapa dos módulos

| Módulo | Pergunta que abre o módulo | Estado |
|---|---|---|
| Apoio A | O que há no GitHub além do básico (issues, PRs — *pull requests* —, Project, labels)? | `apoio-a-github-alem-do-basico.md` |
| Apoio B | O que é um teste automatizado e o que é TDD (*Test-Driven Development*, desenvolvimento guiado por testes)? | `apoio-b-testes-e-tdd.md` |
| Apoio C | O que é integração contínua (CI) e por que ela existe? | `apoio-c-integracao-continua.md` |
| Apoio D | Por que usar contêineres (Docker e Compose)? | `apoio-d-conteineres-docker-e-compose.md` |
| **0** | O que significa um caso de uso estar "pronto"? | `m00-o-caso-pronto.md` |
| **1** | "100% coberto": quem prova? | `m01-cobertura-real.md` |
| 2 | Por que o plano e a realidade divergem? | `m02-estado-como-fonte.md` |
| 3 | Por que a `main` ficou vermelha? | `m03-fatia-e-main-verde.md` |
| 4 | Por que "na minha máquina funciona" não basta? | `m04-fundacao-ambiente-reprodutivel.md` |
| 5 | Onde mora a regra de negócio? | `m05-onde-mora-a-regra.md` |
| 6 | O que o cliente vê quando o banco falha? | `m06-quando-o-banco-falha.md` |
| 7 | Seu teste prova alguma coisa? | `m07-seu-teste-prova-algo.md` |
| 8 | Como persistir de verdade? | `m08-persistir-de-verdade.md` |
| 9 | Alguém olhou o contrato real da API (*Application Programming Interface*, a interface pela qual outros programas usam o seu)? | `m09-contrato-real-da-api.md` |
| 10 | E se uma fatia aparecer tarde demais? | `m10-fatia-descoberta-tarde.md` |
| 11 | Outra pessoa consegue repetir sua verificação? | `m11-verificacao-repetivel.md` |
| 12 | Quem aprova, e o que a IA pode fazer? | `m12-quem-aprova.md` |
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
4. **A IA não aprova nada.** Aprovar uma fase, fechar uma issue ou integrar um PR (*pull request*, a proposta de mudança que você abre no GitHub para ser revisada e integrada) é decisão sua (ou de quem tem essa responsabilidade no seu grupo).
5. **Registre quando delegar.** Se você pedir que a IA revise algo no seu lugar, anote que foi revisão de IA. Ela não substitui uma revisão independente.
6. **Ela erra, e você também.** No piloto que originou este curso, a própria IA esqueceu de conferir o código de saída de um validador mais de uma vez; o CI pegou. A defesa é o processo, não a confiança.

## Siglas usadas no curso

| Sigla | Significado | Em uma frase |
|---|---|---|
| ADR | *Architecture Decision Record*, registro de decisão de arquitetura | Documento curto que guarda **uma** decisão: contexto, o que foi decidido e consequências |
| API | *Application Programming Interface* | A interface pela qual outros programas usam o seu sistema (aqui, os endereços HTTP) |
| CA | Critério de Aceite | Condição que o caso de uso precisa cumprir para ser aceito (CA01, CA02...) |
| CI | *Continuous Integration*, integração contínua | Um robô que roda testes e verificações a cada mudança enviada ao GitHub |
| CLI | *Command-Line Interface*, interface de linha de comando | Programa usado pelo terminal, como o `gh` do GitHub |
| DTO | *Data Transfer Object* | Classe que descreve e valida os dados que chegam pela API |
| E2E | *End-to-End*, de ponta a ponta | Teste que usa o sistema como o usuário usaria, com banco real |
| FA | Fluxo Alternativo | Caminho do caso de uso diferente do principal (FA01, FA02...) |
| FE | Fluxo de Exceção | Caminho do caso de uso quando algo dá errado (FE01...) |
| HTTP | *HyperText Transfer Protocol* | O protocolo pelo qual um cliente pede algo a uma API e recebe resposta |
| IA | Inteligência Artificial | Aqui, os assistentes de código que você usará |
| ORM | *Object-Relational Mapping* | Biblioteca que traduz objetos do código em linhas de tabelas do banco (aqui, o TypeORM) |
| PK | *Primary Key*, chave primária | Coluna que identifica cada linha da tabela sem repetição |
| JSON | *JavaScript Object Notation* | Formato de dados em texto usado nos corpos de requisição e resposta |
| PR | *Pull Request* | Proposta de mudança no GitHub, revisada antes de entrar na `main` |
| RF | Requisito Funcional | O que o sistema deve fazer (RF01, RF02...) |
| RN | Regra de Negócio | Regra do domínio que o sistema deve respeitar (RN01, RN02...) |
| SQL | *Structured Query Language* | Linguagem de consulta e comando dos bancos relacionais |
| TDD | *Test-Driven Development* | Escrever o teste antes do código |
| UC | *Use Case*, caso de uso | Descrição de um comportamento do sistema do ponto de vista de quem o usa (UC12 é o décimo segundo do projeto CeliLac) |
| YAML | formato de texto para dados estruturados | Formato do `state.yaml`: legível por pessoas e por programas |

## Material de consulta
- Visão geral do método: `method/README.md` e `method/glossario.md`.
- O piloto completo em forma de relato: `method/didatico/06-piloto-reconciliando-o-uc12.md`.
- O estado final do caso real: `docs/uc/uc12/state.yaml`.
