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

## Matriz atual de artefatos do aluno (issue #99)

A coluna “instrução” aponta o momento do curso em que o aluno produz ou adapta o artefato. A aplicação só apresenta o material; tudo abaixo é criado e guardado no repositório e nas ferramentas do aluno. Os modelos entram no kit como arquivos de `method/templates/`; adaptação e cópia para a raiz ocorrem no passo indicado.

| Artefato | Etapa e caminho no projeto do aluno | Instrução e prática | Modelo | Momento no kit / adaptação | Verificação e limite |
|---|---|---|---|---|---|
| Documento do caso de uso | M00 e M02; `docs/planejamento/<uc>.md` | M00 escolhe caso e preenche; M02 referencia o arquivo no estado | `method/templates/caso-de-uso.md` | `method/` chega no kit no início; aluno copia e personaliza no M00 | Revisão de requisitos; `check-state` confere caminho, não qualidade semântica |
| Estado do caso de uso | M02; `docs/uc/<uc>/state.yaml` | `m02-pratica.md`, passos 1–5 | `method/templates/state.yaml` | Modelo vem no kit; copiar/adaptar em M02 | `method/scripts/check-state.sh`; confere estrutura, coerência e caminhos, não veracidade de texto colado |
| Perfil do projeto | M04; raiz do repositório | M04, passo 2; usar comandos reais | `method/templates/project-profile.md` | Kit entrega com identidade mínima e demais campos `a confirmar`; aluno confirma/preenche em M04 | Revisão de comandos; não há validador semântico |
| `AGENTS.md` próprio do aluno | M12, passo 2; raiz do repositório | `m12-pratica.md`: copiar modelo e personalizar cinco regras | `method/templates/AGENTS-aluno.md` | Modelo é copiado junto com `method/`; **não** é copiado para a raiz durante a montagem do kit. A cópia para raiz acontece no M12. `method/AGENTS.md` permanece em `method/` e não é duplicado. | Conferir existência na raiz e a distinção/localização dos dois arquivos; revisão humana das regras |
| Issues de fase/fatia | Apoio A e M04; GitHub do projeto | Práticas Apoio A/M04 | `method/templates/issue-fatia.md` e formulários GitHub | Formulários no kit; issues são criadas pelo aluno no momento de cada trabalho | `check-state --remote` pode consultar números/estado; não prova qualidade dos critérios |
| Branch e PR | Apoio A e cada fatia; GitHub do projeto | Apoio A, passos 2–4; M03 e módulos seguintes | Convenções do perfil e formulário de PR | Formulários no kit; branch/PR só são criados quando a atividade chega a essa etapa | GitHub/CI; estado remoto não prova desenho correto |
| Relatórios A–F | Cada fase; `docs/uc/<uc>/relatorios/{A..F}.md` | Playbooks e projeto final | `method/templates/relatorio-de-fase.md` | Modelo vem no kit; uma cópia/adaptação por fase | `check-state` confere campos/caminhos; julgamento do gate é humano ou CI |
| ADRs | Quando uma decisão for tomada; `docs/adr/ADR-NNN-*.md` | M01, M06, M09, M10, M12 | `method/templates/adr.md` | Modelo vem no kit; não há ADR preenchida antecipadamente | Revisão humana; validador não prova mérito da decisão |
| Contrato observado da API | M09, fase D; `docs/uc/<uc>/contrato.md` | `m09-pratica.md`: inventário executado, decisão, testes e repetição | **Novo:** `method/templates/contrato-api.md`, distinto de `caso-de-uso.md` | Modelo vem no kit; aluno copia sem sobrescrever arquivo em M09, depois do inventário | Saídas D, testes de contrato e revisão/aprovação humana; inventário não substitui teste |
| Evidências de comando | Fases indicadas; `docs/uc/<uc>/evidencias/<fase>/<nome>.txt` | Práticas que executam verificações, em especial M02 e M05–M11 | **Novo:** `method/templates/evidencia-de-comando.md` | Modelo vem no kit; copiar/preencher após cada execução relevante | Revisar comando, data/hora UTC, commit base, código de saída e saída real. `check-state` verifica existência do caminho, não autenticidade da saída |
| Código, testes e migrations | M03–M11; diretórios existentes do projeto | Práticas individuais dos módulos e apoios | Sem modelo único; seguir a estrutura do projeto | Não vem pronto no kit; aluno cria no módulo correspondente | Testes/CI e revisão do diff; cada afirmação requer evidência pertinente |
| Workflow de CI | Apoio C e M04; `.github/workflows/` | `apoio-c-pratica.md` e `m04-pratica.md` | Conteúdo didático adaptável no Apoio C | Kit não entrega workflow verde pronto; aluno constrói nos apoios/M04 | Execução real do CI e revisão de segredos/escopo |
| Ambiente e verificação | Apoio D/M04; `compose.yaml`, `.env.example`, `.gitignore`, script do projeto | Práticas Apoio D e M04 | Orientação nos passos; sem cópia pronta | Kit não entrega ambiente ou script como solução pronta | `docker compose ps`, script real e cópia limpa, com saídas guardadas; comandos destrutivos continuam sujeitos às regras do método |
| Verificação repetível | M11; coleção `.http`, script e evidências da fase E | `m11-pratica.md` | Roteiro do módulo; adaptar no projeto | Criado pelo aluno em M11; o kit não inclui saída nem script de referência como resultado | Controle negativo, código de saída, durabilidade sem reiniciar banco e log do CI |

### Inventário das práticas em arquivo próprio

Confirmado no checkout atualizado: 17 seções de prática (Apoios A–D, M00–M12); havia somente `m02-pratica.md`. Esta revisão cria os outros 16 arquivos. Cada módulo/apoio aponta para seu arquivo por front matter (`pratica`) e pela seção de prática; M02 permanece ligado ao arquivo que já existia.

| Origem / etapa | Arquivo de prática | Entrega verificável e onde guardar | Modelo/critério de conferência |
|---|---|---|---|
| Apoio A / Fase A | `apoio-a-pratica.md` | Issue, branch, commit e PR do aluno no GitHub; rastreio em relatório A | Formulário de issue; conferir ligações issue/commit/PR |
| Apoio B / Fase B | `apoio-b-pratica.md` | Teste RED/GREEN, refactor e mutação revertida; `evidencias/B/` | Evidência de comando; comparar teste, saída e comportamento |
| Apoio C / fundação | `apoio-c-pratica.md` | Workflow e execuções CI verde/vermelha/verde; `evidencias/A/` | Conferir workflow e execuções reais no GitHub |
| Apoio D / fundação | `apoio-d-pratica.md` | Compose e arquivos de ambiente; `evidencias/A/` | Conferir saúde, persistência após `stop`/`up` e ausência de segredo versionado |
| M00 / planejamento | `m00-pratica.md` | `docs/planejamento/<uc>.md` e respostas às perguntas no relatório A | `caso-de-uso.md`; conferir ator, fluxo, duas regras e falha |
| M01 / planejamento | `m01-pratica.md` | Matriz de cobertura em relatório A e ADR em `docs/adr/` | `adr.md`; conferir que nada está “coberto” sem teste identificado |
| M02 / planejamento | `m02-pratica.md` (já existia) | `docs/uc/<uc>/state.yaml`; saídas em `evidencias/A/` | `state.yaml` e `check-state.sh`; evidências de erro e sucesso reais |
| M03 / B | `m03-pratica.md` | Teste/commits/PR por fatia; `evidencias/B/` | Estado/issue/PR e saídas RED/GREEN |
| M04 / fundação | `m04-pratica.md` | Perfil, banco de teste, verificador e CI; `evidencias/A/` | Perfil real, travas, cópia limpa e CI |
| M05 / B | `m05-pratica.md` | Regras e testes do núcleo; `evidencias/B/` | Testes de limite e mutação revertida |
| M06 / B e C | `m06-pratica.md` | Testes de falha, ADR, mapeamento HTTP e log; `evidencias/B/` e `C/` | Ausência de vazamento no corpo, teste e saída real |
| M07 / B | `m07-pratica.md` | Matriz de mutantes e saídas; `evidencias/B/` | Cada mutação é isolada e desfeita |
| M08 / C | `m08-pratica.md` | Migration, adaptador e testes de banco; `evidencias/C/` | Consulta SQL independente, banco vazio seguro e mutação |
| M09 / D | `m09-pratica.md` | `docs/uc/<uc>/contrato.md` e inventários em `evidencias/D/` | Novo `contrato-api.md`; comparar inventários e testes |
| M10 / fase afetada | `m10-pratica.md` | Nota, estado e relatório em `docs/uc/<uc>/`; issue/PR do aluno | `check-state.sh`; preservar histórico e gates |
| M11 / E | `m11-pratica.md` | Coleção, script e saídas em `evidencias/E/` | Controle negativo específico, durabilidade e execução CI |
| M12 / F | `m12-pratica.md` | `AGENTS.md` de raiz, relatório F e evidências | `AGENTS-aluno.md`; conferir raiz, não duplicar regras do método, revisão humana |

### Gabaritos para autoestudo

Contagem conferida no checkout: 14 gabaritos (`m01`–`m12`, Apoio C e projeto final). Todos mantêm o escopo técnico já ensinado e agora são públicos para autoestudo: a recomendação para tentar primeiro não bloqueia acesso. Os títulos, avisos e seções de discussão/avaliação foram convertidos para orientar comparação e autoavaliação. Fatos do projeto de referência estão identificados como registros anteriores, não como execuções do estudante nem desta revisão. Resultados variáveis (como saídas de comandos) são esperados apenas quando o próprio texto do gabarito já os distingue; o aluno deve produzir a própria evidência com o modelo de comando.

## Próximos passos de conteúdo

O inventário da issue #99 foi implementado nesta revisão: modelo de contrato observado, modelo de evidência, 16 práticas faltantes, 14 gabaritos para autoestudo e reconciliação do momento de criação/adaptação dos artefatos. Permanecem as limitações de verificação semântica já descritas: um caminho existente não prova que o artefato está correto ou que uma saída foi realmente executada.

## Limites da auditoria

Esta revisão foi baseada no curso, templates, scripts e código do repositório no commit indicado. Não inclui entrevista ou teste com aluno. Não afirma verificação manual por leitor de tela ou medição em navegador real; os resultados automatizados e manuais desta revisão devem ser registrados separadamente no PR.
