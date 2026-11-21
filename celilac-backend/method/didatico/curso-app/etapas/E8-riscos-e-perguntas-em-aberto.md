# E8 — Riscos e perguntas em aberto

> Etapa E8 do plano da aplicação web do curso. Data: 2026-11-21. Situação: **validada pelo professor em 2026-11-21** (todas as recomendações aprovadas, P1 a P8 e critérios do M7).
> Convenção: **[Fato]** lido no repositório (com caminho) ou executado nesta sessão; **[Recomendação]** proposta minha; **[Suposição]** a confirmar.
> Nenhum arquivo do curso nem do método foi alterado nesta etapa. Nenhuma dependência foi instalada.

---

## 1. Entradas desta etapa
- O prompt pede, no mínimo, dois riscos: **conteúdo que muda no repositório e diverge do site** e **aluno que marca "feito" sem fazer**. A E4 (seção 3.4), a E5 (seção 8) e a E6 (seção 10) deixaram os dois para cá.
- A E7 (seção 4.1) deixou os **critérios de aceite do M7** para esta etapa, e a seção 7 dela deixou a **decisão de distribuição** para depois da E8.
- Decisões que limitam as mitigações possíveis: a aplicação não tem rede, não lê o repositório do aluno e não chama serviços externos (E1, seção 7; E4, seção 7, regra 3); só confere a forma (N1) (E6, seção 3).

**Escala usada nas tabelas.** Probabilidade e impacto em três níveis (baixo, médio, alto). [Suposição] São julgamento meu, sem dado de uso: a aplicação ainda não existe e não foi usada por turma.

## 2. Risco 1 — Conteúdo que muda no repositório e diverge do site

### 2.1. Onde a divergência pode acontecer
Dentro de uma imagem **não há divergência**: o site inteiro é gerado de um único commit, que aparece no rodapé (E1, seção 7; E7, M0). A divergência aparece **entre** coisas:

| # | Entre o quê | Exemplo | Probabilidade | Impacto |
|---|---|---|---|---|
| D1 | Imagem do aluno × repositório atual | o aluno construiu a imagem há três semanas; o módulo foi corrigido depois | **alta**: [Fato] 19 commits tocaram `method/didatico/curso/` desde 2026-11-01 (`git log --since`) | médio |
| D2 | Progresso gravado × texto novo do passo | passo reescrito com o mesmo número | média | médio |
| D3 | Progresso gravado × checklist novo | item inserido no meio do checklist "Como saber que funcionou" | média | **alto**: ver 2.2 |
| D4 | Conteúdo removido ou renomeado (`id` mudou) | módulo dividido em dois | baixa | médio |
| D5 | Kit aplicado no repositório × kit da imagem nova | `method/` corrigido depois que o aluno aplicou o kit | alta | médio |
| D6 | Texto do curso × código do CeliLac | [Fato] 3 arquivos do curso citam commits fixos do código (por exemplo, `m05-gabarito.md`: "no commit `b71f5e1`"); o código continua mudando | média | baixo: o commit fixo **é** a mitigação, desde que continue existindo |
| D7 | Equipe com dados de projeto diferentes | um integrante importou uma exportação antiga | média | médio |

### 2.2. Achado: checklist chaveado pela posição
[Fato] O exemplo de formato da E4, seção 3.2, guarda o checklist por posição (`"checklist": { "0": true }`), e a impressão digital existe só para o **passo** inteiro (E4, seção 3.4). Se um item for inserido no início, a marcação do item 0 passa a valer para outro texto, **sem aviso**, porque o checklist de módulo (`conteudos`) não tem impressão digital. É o pior tipo de divergência: silenciosa e com cara de progresso.

**[Recomendação]** Chavear cada item de checklist pela impressão digital do **texto do item** (normalizado: espaços e maiúsculas), e não pela posição. Item cujo texto mudou aparece como "não marcado — o texto deste item mudou", com a marcação antiga visível ao lado. Isso muda um detalhe do formato aprovado na E4 (não a estrutura por escopos) e entra no M3, antes de existir qualquer dado de aluno, o que evita migração.

### 2.3. Mitigações propostas
| Divergência | Mitigação | Já decidida? | Marco |
|---|---|---|---|
| D1 | Rodapé com o commit **e a data** do commit; página "Sobre esta versão" com os comandos para atualizar (`git pull` e construir de novo). A aplicação **não** consegue saber que existe versão nova, porque não tem rede, e diz isso | commit: sim (E7, M0); data e página: **não** | M0 e M7 |
| D2 | Impressão digital do texto do passo e aviso "este passo mudou desde que você o marcou" | sim (E4, seção 3.4) | M4 |
| D3 | Seção 2.2 | **não** | M3 |
| D4 | Dado cujo `id` não existe mais vai para `legado` e é mostrado na tela "Seus dados", nunca descartado (mesma regra da migração, E4, seção 5). [Recomendação] Front matter ganha `substitui: [<id antigo>]` **só quando** um `id` for renomeado, e a aplicação leva o progresso junto | `legado`: sim; `substitui`: **não** | M3 (regra); E3, parte 2 (campo, se usado) |
| D5 | Tela "Comparar meu kit": o aluno **escolhe** o `manifesto.json` que está no repositório dele; a aplicação compara as impressões digitais com o kit atual e lista os arquivos que mudaram, com o prompt de atualização que não sobrescreve (o mesmo da E5, seção 5) | manifesto: sim (E5, seção 4.4); tela: **não** | M7 |
| D6 | Nenhuma ação na aplicação. [Recomendação] Conferir, no CI da aplicação, que os commits citados no curso existem (`git cat-file -e`); falha impede a imagem | **não** | M1 |
| D7 | A exportação "projeto" mostra a data e quem a fez (texto livre); a tela diz que a referência comum da equipe é o repositório (E4, seção 2) | parcial | M4 |

**Por que a tela "Comparar meu kit" não contraria a E1.** Ela não lê o repositório: o aluno escolhe um arquivo, como já faz com o caso de uso (E2, seção 7) e com o `state.yaml` (E6, seção 4). O arquivo é dado, conferido só pela forma. Decisão sua (pergunta P2, seção 5).

## 3. Risco 2 — Aluno que marca "feito" sem fazer

### 3.1. O que não muda
[Fato] A E6, seção 8, item 6, já declara que a aplicação não prova "que o aluno fez o passo que marcou". Nenhuma trava resolve isso no navegador: qualquer regra (tamanho mínimo, palavra-chave, tempo na página) é contornável e daria falsa impressão de verificação, pelo mesmo motivo da E4, seção 6. Com o curso autônomo, sem nota e sem área do professor (E0, P4′), **quem perde com a marcação falsa é o próprio aluno**.

### 3.2. Onde o risco fica sério
| Situação | Por que importa | Probabilidade | Impacto |
|---|---|---|---|
| O curso é usado numa disciplina com nota, e alguém avalia pelo `.json` exportado ou por uma captura de tela da aplicação | o progresso declarado vira "evidência" | média | **alto** |
| A tela de progresso premia marcar (percentual, medalha, cor de sucesso) | incentiva marcar para "completar" | média | médio |
| O assistente de IA do aluno gera a saída esperada e o aluno marca o checklist com base nela | evidência inventada, a mesma da E6, seção 10 | média | alto |

### 3.3. Mitigações propostas
1. **Nada na aplicação vale como avaliação.** [Recomendação] A documentação da aplicação e a tela "Seus dados" dizem: "o arquivo exportado é o seu registro pessoal; não é evidência do seu trabalho. A evidência está no seu repositório". Já decidido em parte: rótulo "declarado por você" e nenhuma cor de sucesso em declaração (E6, seção 9; E7, M3, critério 6).
2. **Sem percentual único de conclusão.** [Recomendação] A tela de progresso mostra **contagens por rótulo** ("12 itens declarados por você; 3 com a forma conferida; 9 a confirmar no seu repositório"), não "75% concluído". Sem medalhas nem recompensas. Os mascotes continuam decorativos e aleatórios (decisão registrada), não prêmio por marcar.
3. **Marcar pede o que se viu, sem exigir.** [Recomendação] Ao marcar um item de checklist ligado a um comando, um campo opcional "o que apareceu na saída?" e o lembrete de guardar a saída em `evidencias/` com o cabeçalho (E6, seção 9). O campo não é conferido e a tela diz isso.
4. **Fases: o arquivo vale mais que a declaração.** Já decidido: o `state.yaml` colado, quando existe, é a fonte das fases, e as duas aparecem lado a lado se divergirem (E6, seção 4.2).
5. **Texto do curso.** [Recomendação] Os checklists "Como saber que funcionou" descrevem um resultado **observável no repositório** ("o validador termina com `OK`"), não um sentimento ("entendi"). Revisão de texto na E3, parte 2; decisão sua item a item.
6. **Para quem usar o curso com nota** (fora do escopo da aplicação): avaliar pelo repositório, com N2 e N3 (E6, seção 3). A aplicação não oferece nada que substitua isso.

## 4. Demais riscos (consolidados das E1 a E7 e novos)
Situação: **mitigado** = a mitigação já existe no repositório; **decidido** = aprovada, a implementar; **proposto** = novo nesta etapa.

| # | Risco | Prob. | Impacto | Mitigação | Situação |
|---|---|---|---|---|---|
| R3 | Progresso perdido por outra porta ou endereço, janela anônima ou limpeza do navegador | alta | alto | comando e endereço únicos; exportar e importar; lembrete por módulo; armazenamento persistente (E4, seção 4) | decidido |
| R4 | **Porta 4321 ocupada** no computador do aluno; ele muda a porta e o progresso "some" | média | alto | [Recomendação] a tela inicial compara o endereço atual com `127.0.0.1:4321` e, se for outro, avisa que o progresso fica separado por endereço e sugere exportar antes de trocar | proposto |
| R5 | Aluno descompacta o kit por cima do repositório | média | alto | pasta separada, prompt que compara antes (E5, seção 5) | decidido |
| R6 | CI do aluno vermelho por causa do método | — | — | `method/` portátil, PR [#82](https://github.com/evertonfoz/dsc-tests/pull/82) | mitigado |
| R7 | Validador do navegador diverge do terminal | baixa | alto | núcleo único, PR [#84](https://github.com/evertonfoz/dsc-tests/pull/84); teste de equivalência (E7, M6) | mitigado no método; teste decidido |
| R8 | "Forma conferida" lida como "aprovado" | média | alto | rótulos fixos e cor neutra (E6, seção 9) | decidido |
| R9 | Assistente de IA do aluno faz merge, fecha issue ou executa comando destrutivo | média | alto | aviso honesto e proteção opcional da `main` (E5, seção 7.3). **Novo:** ver R10 | decidido |
| R10 | **Um prompt fornecido pela própria aplicação leva o assistente a um comando destrutivo** no banco do aluno. [Fato] 8 arquivos do curso citam `down -v`, `DROP`, `TRUNCATE` ou `migration:revert`, hoje sempre como proibição (por exemplo, `apoio-d-conteineres-docker-e-compose.md`, linhas 87 a 89; `m11-verificacao-repetivel.md`, linha 74). O prompt diz que a aplicação nunca executa comandos no banco do aluno; o prompt que ela entrega é a via indireta | baixa | **alto** | [Recomendação] na construção, todo bloco de prompt de prática (E2, seção 5.3) que contiver um desses comandos **falha a imagem**, salvo marcação explícita de proibição; e todo prompt termina com a regra de parar e perguntar antes de ação destrutiva (regra 8 do `AGENTS.md`) | proposto |
| R11 | Aluno cola o `state.yaml` do UC12 | baixa | médio | aviso (E6, seção 4.4) | decidido |
| R12 | Markdown do aluno ou `.json` importado com HTML ou script (XSS, *cross-site scripting*: injeção de script na página) | baixa | alto | HTML embutido desligado; importação validada (E4, seção 5; E7, M4, critério 3) | decidido |
| R13 | Exportação enviada a colega leva tentativas e anotações pessoais | média | baixo | aviso antes de exportar (E4, seção 7, regra 4) | decidido |
| R14 | Prática guiada só existe no m02 até a E3, parte 2; o aluno vê 1 de 17 seções como passo guiado | **alta** (é o estado atual) | médio | [Recomendação] nos módulos sem arquivo de prática, a tela diz "prática guiada ainda não disponível; siga a seção do módulo" | proposto |
| R15 | Gabaritos com o texto "Uso exclusivo do professor" num curso autônomo | alta (estado atual) | baixo | nota provisória (E4, seção 6) até a reescrita | decidido |
| R16 | Caso de uso de tipo diferente de "criar" | média | médio | aviso de honestidade (E7, M1); [Fato] `projeto-final.md`, linha 46, declara o limite, mas manda "avise o professor" (texto a revisar, já na lista da E0, seção 3.3) | decidido |
| R17 | Docker ausente ou pesado demais na máquina do aluno | média | alto | é requisito do curso, não só da aplicação (regra de honestidade do prompt); a aplicação diz isso no índice. [Suposição] Comportamento em Windows e em máquinas com pouca memória não foi testado | decidido (aviso) |
| R18 | Tecnologia (Astro, servidor estático) incompatível com o Node 24.21.0 ou com versões futuras | baixa | médio | versões fixas e conferência no plano do M0 (E7, seção 2) | decidido |
| R19 | Dependências da construção com vulnerabilidade conhecida | média | baixo: nada roda no servidor além de arquivos estáticos | versões fixas; [Recomendação] auditoria de dependências no CI da aplicação, sem bloquear por aviso de baixa severidade | proposto |
| R20 | Estimativa de 13 a 24 sessões estourada | média | médio | premissas da E7, seção 5; reestimar ao fim do M1 | decidido |
| R21 | Uso real no celular impossível com `127.0.0.1` | alta | baixo | limite declarado (E7, seção 8.3); depende da publicação | decidido |
| R22 | **Repositório público sem licença.** [Fato, executado nesta sessão] `gh repo view`: `visibility: PUBLIC`, `licenseInfo: null`; não há arquivo `LICENSE` na raiz do `dsc-tests` nem em `celilac-backend/` e `mascotes/`. Sem licença, ninguém tem permissão explícita de reutilizar o curso, o método, o código ou os mascotes, e publicar uma imagem num registro público redistribui tudo isso | alta (estado atual) | médio | decisão sua antes do M7 (pergunta P5) | proposto |
| R23 | Publicação na internet: registros de acesso da hospedagem e LGPD (Lei Geral de Proteção de Dados Pessoais) | — | — | aviso sobre os registros; análise jurídica pendente (E4, seção 7, regra 5) | pendente, só se publicar |
| R24 | Manutenção depois do curso: uma pessoa decide, e a aplicação depende de o conteúdo continuar gerando a imagem | média | médio | o CI da aplicação dispara em mudanças de conteúdo (E7, seção 6), então quem quebrar a geração descobre no PR | decidido |

## 5. Perguntas em aberto (para você decidir)
| # | Pergunta | Recomendação | Onde entra |
|---|---|---|---|
| P1 | Chavear itens de checklist pela impressão digital do texto, e não pela posição? (seção 2.2) | Sim | M3 |
| P2 | Criar a tela "Comparar meu kit", com o `manifesto.json` escolhido pelo aluno? (seção 2.3, D5) | Sim, no M7 | M7 |
| P3 | Data do commit no rodapé e página "Sobre esta versão"? Campo `substitui` no front matter só quando um `id` for renomeado? (D1, D4) | Sim para os dois; `substitui` só se um dia for preciso | M0, M3 |
| P4 | Progresso por contagens de rótulo, sem percentual único nem recompensa? (seção 3.3, itens 2 e 3) | Sim | M3 |
| P5 | Que **licença** para o curso, o método, o código da aplicação e os mascotes? (R22) | Decidir antes de publicar a imagem; é decisão sua, não técnica | antes do M7 |
| P6 | Falhar a construção quando um prompt de prática trouxer comando destrutivo sem marcação de proibição? (R10) | Sim | M4 (o formato do prompt é lido ali) |
| P7 | Conferir no CI da aplicação que os commits citados no curso existem? (D6) | Sim | M1 |
| P8 | Distribuição: construir localmente ou publicar num registro (E7, seção 7)? | Manter a construção local até o M6, como aprovado; decidir no M7 **depois** de P5 e da análise da LGPD, se for publicar na internet | M7 |

**Pendências antigas que continuam abertas** (já registradas no `estado.md`; listadas para não se perderem, sem decisão nova): README do curso diz que o apoio D não tem gabarito; o m01 pede o apoio B antes de a sequência levar a ele; passos que dependem de outra pessoa (m11, passo 5; m12, passo 6); convenção de cabeçalho das evidências a registrar no método; `permissions: contents: read` no `ci.yml` do apoio C; `m02-pratica.md` apontando para o kit.

## 6. Critérios de aceite do M7 (a E7 deixou para cá)
1. **Divergência:** com o progresso gravado numa imagem e o conteúdo alterado noutra (passo reescrito, item de checklist inserido no meio, `id` removido), a tela mostra os avisos da seção 2.3 e nada é descartado (teste no navegador com duas imagens).
2. **Kit:** "Comparar meu kit" lista exatamente os arquivos cujas impressões digitais mudaram, e um `manifesto.json` inválido é recusado com o motivo (teste).
3. **Versão:** rodapé com commit e data; a página "Sobre esta versão" diz que a aplicação não sabe se há versão mais nova (teste).
4. **Endereço:** aberta noutra porta, a aplicação mostra o aviso do R4 (teste).
5. **Progresso:** nenhuma tela mostra percentual único de conclusão nem cor de sucesso em declaração (teste).
6. **Roteiro completo** do m00 ao kit e às fases, em navegador limpo, no computador e no celular (largura de 320 pixels) (teste no navegador).
7. **Manual:** roteiro só com teclado e com leitor de tela, registrado no PR como "executado" ou "a confirmar".
8. **Distribuição:** conforme a decisão P8; se publicar, licença definida (P5) e aviso de privacidade da hospedagem (R23) na tela.

## 7. Divergências e pendências encontradas nesta etapa
- **Registro do PR #85.** O `estado.md` deixou "data e commit de merge a registrar na sessão da E8". [Fato, executado nesta sessão] `gh pr view 85`: `MERGED` em 2026-11-21T13:37:21Z, commit de merge `ebac83b`, cabeça `1e5973a`; `gh pr checks 85`: os quatro trabalhos com `pass` (execução 44909659167); `git ls-remote`: a branch `docs/curso-app-e7-marcos` ainda existe no remoto. Registrado no `estado.md`. <!-- links:ignore -->
- **Checklist chaveado pela posição** (seção 2.2): detalhe do formato da E4 que contradiz o objetivo da própria E4, seção 3.4. Não invalida a E4; ajusta o exemplo de formato.
- **Repositório público sem licença** (R22): fato do repositório, não divergência com decisão.

---

## Fechamento

**O que foi feito:**
- Análise das sete formas de divergência de conteúdo, com mitigações e o achado do checklist chaveado pela posição; análise do "feito sem fazer", com seis mitigações e o limite declarado; consolidação de 22 outros riscos das E1 a E7 e novos; oito perguntas em aberto; critérios de aceite do M7.
- Executados nesta sessão (somente leitura): `gh pr view 85`, `gh pr checks 85`, `git ls-remote` da branch da E7, `gh repo view` (visibilidade e licença), `git log --since=2026-11-01` sobre `method/didatico/curso/`, buscas por commits citados e por comandos destrutivos no curso.
- Lidos: E4, E5 (seções 4 a 8), E6 e E7 inteiras; front matter de `m05-gabarito.md`; cabeçalho e títulos de `m02-pratica.md`.

**O que não foi verificado:**
- As probabilidades e os impactos são julgamento meu, sem dado de uso.
- Que os 2 commits citados no curso ainda existem no histórico (a conferência da P7 não foi executada).
- O comportamento do `localStorage` com troca de porta continua sendo conhecimento da plataforma, não testado (como na E4).
- Docker em Windows e em máquinas com pouca memória.
- Nenhuma análise jurídica (licença, LGPD).

**O que você precisa decidir:**
1. As perguntas **P1 a P8** da seção 5.
2. Os **critérios de aceite do M7** (seção 6).
3. Autorizar **branch e PR da E8**, com este documento e o registro do PR #85 no `estado.md`. O merge não está delegado, salvo decisão sua.
