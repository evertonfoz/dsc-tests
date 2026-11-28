# 03 — Anatomia de um playbook, fatias e cobertura real

> **Público:** estudantes que usarão o método e quem for criar novos playbooks.
> **Objetivo:** entender como um procedimento de fase é escrito, o que é uma fatia, por que "100% coberto" precisa de prova, e como tratamos tipos de caso de uso que ainda não executamos.
> **Pré-requisitos:** documentos 01 e 02.

---

## 1. Playbook: o procedimento de uma fase

Os 13 materiais anteriores eram prompts de 30 a 55 KB, com muito texto repetido e dados do CeliLac misturados ao procedimento. O playbook faz o oposto: **curto, uma fase, sem dados do projeto**.

O modelo está em `method/templates/playbook.md`. Seus dez blocos:

| Bloco | Pergunta que responde | Por que existe |
|---|---|---|
| Objetivo | O que existe ao final? | Evita fases sem propósito |
| Entradas | O que já está no repositório? O que preciso perguntar? | Não pedir de novo o que já se sabe (regra 2) |
| Gate de entrada | Posso começar? | Impede pular fases |
| Passos | Como faço, como verifico, que evidência guardo? | Cada ação nasce com a sua prova |
| Artefatos | O que sai daqui? | Um relatório curto, evidências brutas, ADRs |
| Gate de saída | Terminei? Quem confirma? | Veredicto é humano ou do CI |
| Proibições | O que não devo fazer? | Segurança por padrão |
| Variações por arquétipo | O que muda para consultar, atualizar...? | Reuso entre tipos de UC |
| Erros comuns | O que costuma dar errado? | Conhecimento acumulado |
| Para o estudante | O que aprendi? | Objetivo didático explícito |

> **Princípio:** o playbook diz *o quê e como verificar*; o `project-profile.md` diz *com quais comandos e nomes*; o `state.yaml` diz *em que ponto estamos*.

## 2. Fatia: a unidade de trabalho

**Fatia = comportamento observável do caso de uso**, com regra, critério de aceite e teste RED nomeado. Exemplos: "cadastro com dados válidos", "rejeitar nome vazio". Não são fatias: "criar o DTO", "implementar o controller", "escrever o teste".

### 2.1. Um termo que corrigimos no meio do caminho
Nos documentos anteriores falávamos em "fatia vertical", querendo dizer "um comportamento de ponta a ponta". Ao escrever o primeiro playbook percebemos a contradição: se a fatia atravessasse todas as camadas, a Fase C (HTTP e persistência) não teria o que fazer. Decidimos (ADR-003):

- **Fase B:** a fatia é entregue **no núcleo** (domínio e serviço), com repositório em memória. Um PR por fatia.
- **Fase C:** os **adaptadores** (HTTP e banco) entram, um PR por adaptador, cobrindo todas as fatias já prontas.

Isso acompanha a ordem em que o curso ensina e mantém a `main` sempre verde. A alternativa — o *esqueleto andante*, em que a primeira fatia atravessa tudo — continua descrita como variação avançada.

**Lição:** corrigir um termo ambíguo cedo, e registrar a correção, custa menos do que deixar dois documentos dizendo coisas diferentes.

### 2.2. Regras de corte (resumo)
Um comportamento por fatia · todo critério de aceite mapeia a uma fatia (ou a uma decisão) · teste RED nomeado antes de começar · ordem: feliz → validação → regra → falha de infraestrutura · PR revisável de uma vez · trabalho transversal não vira fatia · sem fatias artificiais. Detalhes em `method/playbooks/guia-decomposicao-em-fatias.md`.

## 3. Cobertura real: o caso do preço do UC12

Reconstruímos, depois do fato, como o UC12 poderia ter sido fatiado e **conferimos no código** o que existe:

- O relatório de consistência `01-12` declarava **100% de cobertura** das regras RN01–RN04, incluindo "preço positivo".
- O código tem apenas `name` em `Product` e no DTO. Não existe preço.
- Não há teste para a falha de persistência (FE01).
- O roteiro `12-10` lista um `CA05` que não existe no `uc-12.md`, que tem CA01 a CA04.

Atenção ao que **não** concluímos: o `uc-12.md` diz que a validação de preço é "ilustrativa" e que seus valores não estão definidos. Deixar de implementá-la pode ser uma decisão razoável. O erro está em **declarar cobertura sem prova e sem decisão registrada**.

> **Regra do método:** ao fim da Fase F, cada item do caso de uso termina com um **teste que o prova** ou uma **ADR de adiamento/exclusão**. Nada é "coberto" por afirmação.

## 4. Como tratamos o que ainda não executamos

O método tem cinco arquétipos de caso de uso: criar, consultar, atualizar, excluir, autenticar. Só **criar** foi exercitado (UC12). Os outros quatro estão em `method/playbooks/matriz-arquetipos.md` como **esboços**, marcados como "não validados em prática", com hipóteses, riscos e o que precisa ser validado.

Por quê? Porque escrever variações sem executá-las reproduz o problema que diagnosticamos: documentação convincente sem evidência. A matriz explica como um esboço é **promovido**: executar um UC real, registrar o que diferiu, atualizar a matriz.

## 5. Exercícios
1. Pegue o `uc.md` do seu caso de uso e liste todos os itens (RF, RN, fluxos, CA). Corte em fatias seguindo a seção 2.2. Algum item ficou sem fatia? Qual decisão você registraria?
2. Reescreva "implementar o controller de produtos" como uma ou mais fatias legítimas.
3. Por que, no método, um PR com a fatia e outro com o adaptador HTTP são separados? O que se ganha e o que se perde?
4. Escolha um arquétipo (consultar, atualizar, excluir ou autenticar) e liste duas diferenças esperadas na Fase E em relação a `criar`. Como você as validaria?
5. Aplique a lição do preço ao seu projeto: há algum "100% coberto" nos seus relatórios sem um teste que o prove?

## 6. Referências
- `method/templates/playbook.md` · `method/templates/issue-fatia.md`
- `method/playbooks/guia-decomposicao-em-fatias.md` · `method/playbooks/matriz-arquetipos.md`
- `method/decisoes/ADR-003-fatia-fases-b-c-e-arquetipos.md`

Próximo documento: **04 — Fundação do projeto** (Etapa 4).
