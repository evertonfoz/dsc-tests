# Auditoria da experiência do curso e dos artefatos

**Data:** 2026-11-21 · **Base examinada:** `main` em `546addd0d39f3315067a2fd32f79ff8b230dea24`, confirmada no GitHub como estado após M3 (#96) e seu registro (#97). Esta auditoria separa fatos do material, problemas observados e recomendações; não afirma ter feito teste com estudantes.

## Diagnóstico da aplicação

### Fatos confirmados
- A rota `/` renderizava integralmente o `README.md` do curso. A apresentação do público e dos resultados ficava seguida pelo índice, avisos, siglas e referências; o primeiro botão explícito de início não existia. O módulo 0 tinha página própria em `/m00/`.
- `/mapa/` mostrava um SVG de pré-requisitos e uma lista extensa com duração, pré-requisitos e estado “Ainda não declarado como lido”. O SVG e a lista repetiam a estrutura, e o estado pressupunha um registro pessoal.
- O M3 (#96) criou `localStorage` (`curso-app.dados`), declarações de leitura, tentativas digitadas, checklists, liberação de gabaritos, importação/exportação, backup, exclusão e a página “Seus dados”. Isso não envia dados a servidor, mas contradiz a direção atual do professor de não registrar respostas nem progresso no app.
- O M3 já marcava no próprio plano que a liberação local não protege o conteúdo estático dos gabaritos contra inspeção dos arquivos. Portanto, o bloqueio era apenas uma etapa de interface e dependia de uma tentativa digitada.
- O layout comum oferece links nativos para apresentação, mapa e UC12. Módulos têm navegação anterior/próximo, enquanto o material UC12 tem retorno para o estado e lista de módulos relacionados. Links externos do curso abrem em nova guia com aviso acessível; isso mantém o app aberto.

### Problemas observados
- A primeira tela priorizava o índice do material sobre uma apresentação curta e uma ação para iniciar.
- O mapa apresentava duas representações principais ao mesmo tempo e adicionava um estado que o curso não precisa guardar.
- O fluxo de gabaritos sugeria uma proteção que o site estático não podia garantir e requeria submeter uma resposta ao site.
- A página “Seus dados”, sua lógica de armazenamento e os testes associados existiam exclusivamente para manter registros pessoais no navegador.
- A E1, E4 e E7 ainda registram decisões antigas de armazenamento e liberação por tentativa. A implementação M3 é um fato histórico; a preferência atual do professor passa a ser a política vigente.

### Recomendações aplicadas nesta revisão
- Apresentação concisa em `/`, com público, objetivo, instruções de uso e ação “Começar pelo módulo 0”; o índice completo permanece em `/indice/`.
- Lista sequencial de módulos como visão principal; o grafo permanece complementar e recolhido por padrão em um `<details>` nativo.
- Remover formulários, checklists editáveis, controles de leitura/tentativa, resumo, persistência, exportação/importação e tela de dados. Atividades são realizadas nos locais declarados pelo material, no repositório e ferramentas do aluno.
- Gabaritos ficam disponíveis como páginas públicas com divulgação nativa `<details>/<summary>` e orientação para tentar antes no local da atividade. Isso é uma convenção pedagógica, não controle de acesso.
- Não embutir o README em iframe ou painel lateral: o índice de conteúdo do curso já pode ser servido como página interna completa (`/indice/`), com navegação comum, breadcrumb, teclado, URL própria e histórico do navegador. A mesma apresentação funciona em celular sem rolagem dentro de painel aninhado.

## Matriz de artefatos do aluno

| Artefato esperado | Etapa e caminho no repositório do aluno | Instrução encontrada | Modelo real | Verificação e limite | Lacuna observada |
|---|---|---|---|---|---|
| `project-profile.md` | Fundação; raiz | M04, prática, passo 2: copiar e preencher com comandos reais | `method/templates/project-profile.md` | M04 e projeto final pedem dados críticos sem `a confirmar`; revisão do conteúdo e comandos no perfil. `check-state` não valida esse arquivo. | Cobertura adequada; o kit futuro precisa manter valores desconhecidos como `a confirmar`, conforme E5. |
| `docs/uc/<uc>/state.yaml` | M02; diretório do caso de uso | `m02-pratica.md`, passos 1–5: copiar, preencher, provocar erro e rodar `check-state.sh` | `method/templates/state.yaml` | `method/scripts/check-state.sh`; verifica estrutura, coerência e existência dos caminhos citados; `--remote` consulta registros GitHub se configurado. | Cobertura adequada. |
| `AGENTS.md` do projeto | M12; raiz do repositório | M12 pede cinco regras para a IA e compara com `AGENTS.md`; projeto final pede o arquivo na raiz | Não havia um modelo próprio do aluno. `method/AGENTS.md` é regra do método, não deve ser copiado para a raiz. | A existência/localização e a revisão humana podem ser conferidas; não há verificador semântico das regras personalizadas. | Lacuna confirmada: a instrução não apontava arquivo-modelo e poderia ser confundida com copiar `method/AGENTS.md`. Esta revisão adiciona `method/templates/AGENTS-aluno.md` e esclarece a localização. |
| Descrição do caso de uso | Antes da prática e M02; `docs/planejamento/<uc>.md` | E2/E5 e `m02-pratica.md` pedem Markdown do aluno | `method/templates/caso-de-uso.md` | O conteúdo pode ser revisto por outra pessoa; o `check-state` verifica caminhos citados, não a qualidade semântica do caso. | Conferir na etapa futura do kit se o modelo é copiado e se o prompt identifica o caminho esperado. |
| Contrato da API (`contrato.md`) | M09, fase D; `docs/uc/<uc>/contrato.md` | M09, passos de prática, pede inventário real e criação do contrato | Não há template `contrato.md`; `method/templates/caso-de-uso.md` descreve o problema do domínio e não substitui o contrato observado da API. | Testes de contrato, inventário executado e aprovação humana; caminhos no `state.yaml` podem ser conferidos. | Lacuna confirmada: falta modelo próprio do contrato de API. Encaminhar à revisão delimitada de conteúdo; não inventar um contrato genérico nesta mudança de navegação. |
| Issues | Fase A e cada fatia; issues reais do projeto no GitHub | Apoio A explica issue, issue principal e subtarefas; M03 liga fatia a issue | `method/templates/issue-fatia.md`; modelos de GitHub também existem na raiz de referência | `check-state --remote` consulta número/estado quando habilitado; critérios e texto ainda dependem de leitura humana. | O aluno precisa adaptar e criar as issues no próprio repositório; o app não cria nada no GitHub do aluno. |
| Branches e pull requests | Uma branch e PR por fatia | Apoio A, M03 e projeto final descrevem branches, revisão e integração | `project-profile.md` contém convenções; formulários de PR existem no repositório de referência | Estado da fatia e `check-state --remote` podem apontar PR; CI confirma checks, mas não decisão de desenho. | A convenção real do aluno deve ser registrada no perfil; nenhum PR é criado pelo app. |
| Relatórios A–F | `docs/uc/<uc>/relatorios/{A..F}.md` | Playbooks e projeto final exigem um relatório por fase | `method/templates/relatorio-de-fase.md` | `check-state.sh` confere caminho e campos estruturais; evidências e gates ainda requerem verificação humana/CI. | Cobertura adequada, desde que os seis playbooks sejam feitos; a aplicação não aprova gates. |
| ADRs | `docs/adr/ADR-NNN-*.md` | M09 e M12 apontam decisões arquiteturais para ADR | `method/templates/adr.md` | Revisão humana e referências; o validador de estado não prova que a decisão está correta. | O aluno deve criar ADR quando houver decisão; conferir se o kit cria diretório e inclui template, não uma ADR preenchida. |
| Evidências A–F | `docs/uc/<uc>/evidencias/<fase>/...` | Práticas M05–M11 mandam salvar saídas reais; E6 define cabeçalho da evidência | Não havia template de arquivo de evidência entre `method/templates/` | `check-state` prova só existência de caminhos; o CI/teste e a leitura da saída verificam o conteúdo. | Lacuna confirmada: convenção existe, mas falta arquivo-modelo simples de evidência de comando; encaminhar à revisão de conteúdo. |
| Prompt do orquestrador | `method/orquestrador/prompt-do-estudante.md` no método copiado | Projeto final/M12 dizem entregar o prompt à IA; regras mandam ler estado e trabalhar uma fase por vez | Prompt real em `method/orquestrador/` | Pode ser inspecionado antes do uso; a IA não valida a si própria. A aplicação não lê o repositório do aluno. | Para kit futuro, confirmar se o prompt identifica a raiz, o UC e o estado existente sem sobrescrever o que o aluno produziu. |

## Próximos passos de conteúdo

O escopo aplicado aqui é a instrução sobre `AGENTS.md` e a navegação sem registros. Permanecem como trabalho de conteúdo próprio: modelo de contrato da API, modelo de evidência, auditoria das demais práticas sem arquivo separado, e alinhamento de gabaritos escritos originalmente para o professor. A matriz acima serve como lista de rastreio; não presume que uma menção ao arquivo prove que o aluno realmente o criou.

## Limites da auditoria

Esta revisão foi baseada no curso, templates, scripts e código do repositório no commit indicado. Não inclui entrevista ou teste com aluno. Não afirma verificação manual por leitor de tela ou medição em navegador real; os resultados automatizados e manuais desta revisão devem ser registrados separadamente no PR.
