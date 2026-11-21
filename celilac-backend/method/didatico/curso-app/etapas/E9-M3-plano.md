# E9 — Plano do marco M3 (progresso e gabaritos)

> Plano de implementação do marco M3 da E9. O escopo funcional já foi aprovado na E7 e nas decisões da E4/E8; este documento detalha a execução, os testes e os limites técnicos, sem alterar conteúdo-fonte do curso.
>
> Convenção: **[Confirmado no repositório]** leitura desta cópia; **[Confirmado no GitHub]** consulta feita nesta sessão; **[Decisão aprovada]** consta de E4, E7 ou E8; **[Implementado]** só será usado depois da alteração correspondente e da validação.

## 1. Estado de entrada

- **[Confirmado no GitHub]** O PR [#94](https://github.com/evertonfoz/dsc-tests/pull/94) está integrado na `main` pelo squash `a890ea3cc443e6e7f883fc490f5ed301c5cf999a`; a issue [#93](https://github.com/evertonfoz/dsc-tests/issues/93) está fechada.
- **[Confirmado no GitHub]** Os seis trabalhos obrigatórios ligados ao commit de cabeça `c04d3a1cce651d13d79ce23174d69366c9f8e852` concluíram com `success`: três no CI do backend e três no CI da aplicação.
- **[Confirmado no repositório]** O commit local `29c992c4d10cf59c66caaeafaa87646dcc26813a` está limpo na branch `codex/curso-app-largura-links`, cujo pai é `c04d3a1`; ele registra o merge, mas não foi publicado. A branch de M3 parte da `main` atual, não incorpora esse commit local e não o remove.
- **[Confirmado no repositório]** A E7 define M3 como progresso, gabaritos e tela “Seus dados”; a E4 define a estrutura local, tentativa e liberação; a E8 define chave de checklist por impressão digital do texto, preservação de dados desconhecidos e contagens sem percentual.
- **Issue de implementação:** [#95](https://github.com/evertonfoz/dsc-tests/issues/95).

## 2. Entrega e limites

O marco guarda um documento JSON por navegador em `localStorage`, na chave `curso-app.dados`. A versão atual permanece **1**, com `meta`, `conteudos`, `preferencias` e `legado`. Cada alteração local registra data e commit do conteúdo. Tentativas e marcações são dados escritos pelo aluno, sem envio a servidor ou avaliação.

Itens de checklist usam uma chave estável derivada do texto normalizado (espaços compactados, Unicode normalizado e minúsculas). Se o texto mudar, a marcação antiga continua armazenada e visível como registro desatualizado, mas o novo item começa desmarcado. IDs de conteúdo removidos do material passam para `legado` e seguem nas exportações.

O gabarito fica acessível pelo fluxo da interface após tentativa não vazia ou confirmação da abertura antecipada. A relação aprovada `gabarito_de` é compartilhada: tentativa em m04 ou no apoio D libera o mesmo arquivo. Os 14 gabaritos recebem nota provisória de que foram escritos para o professor e ainda serão adaptados para autoestudo.

**Limite da arquitetura estática:** a liberação no navegador orienta o fluxo e grava a escolha; ela não protege o texto contra alguém que inspecione os arquivos estáticos da imagem. Não é autenticação, sigilo ou avaliação. A tela identifica a escolha como declaração pessoal.

## 3. Tela “Seus dados”

- Resumo por contagens: leituras declaradas, tentativas e itens de checklist marcados. Sem percentual geral, medalhas, cor de sucesso ou rótulo “verificado”.
- Exportar todos os dados num JSON versionado; importar valida objeto, versão e estrutura antes de qualquer gravação. Limite de 2 MiB.
- Antes de substituir os dados por uma importação integral, o navegador baixa uma cópia automática do estado atual. Se a gravação falhar, o estado anterior permanece.
- Botão de apagar com confirmação e opção de solicitar armazenamento persistente ao navegador, sem prometer que será concedido ou que substitui uma cópia.
- Explicação de armazenamento por navegador/endereço, exposição em computadores compartilhados, dados incluídos na exportação, privacidade dos textos e limite de avaliação.
- Dados de IDs sem página permanecem em `legado` e são mostrados/exportados; não são apagados em silêncio.

Exportação e importação do escopo “projeto” dependem de `projeto` e `casoDeUso`, que só chegam no M4. Neste marco há apenas “tudo”.

## 4. Testes e critérios de aceite

| Critério da E7 | Verificação planejada |
|---|---|
| (1) Tentativa não vazia libera; abertura antecipada fica registrada | Unidade para texto vazio e transições; Playwright grava tentativa no m01, abre o gabarito e confere a tentativa ao lado; outro fluxo confirma abertura antecipada. |
| (2) m04 e apoio D liberam o mesmo gabarito | Playwright libera a partir de cada página, verifica a rota `m04-gabarito` e confirma nota provisória e declaração. |
| (3) Arquivo inválido não grava | Playwright importa JSON malformado/versão inválida e confirma a mensagem e a conservação do estado anterior. |
| (4) Cópia antes de importar tudo | Playwright observa o download automático antes da substituição e confirma a restauração após recarregar. |
| (5) Migração v1→v2 sem perda (consumida no M4) | Teste unitário do migrador aditivo: `meta`, conteúdo, checklist, preferências e legado permanecem iguais; escopos novos iniciam vazios. O formato gravado pelo M3 continua v1 até o M4. |
| (6) Declarações sem aparência de aprovação | Verificação de texto e estilos das declarações; axe-core nas páginas de leitura, mapa, gabaritos e “Seus dados”, em 320 e 1280 pixels. |

Também serão cobertos importação válida e inválida, limite de tamanho, preservação de ID legado, checklist com texto alterado, pedido de armazenamento persistente, ausência de requisições externas e navegação interna.

## 5. Sequência e registro

1. Implementar o modelo e testes unitários isolados do navegador.
2. Conectar progresso à leitura, tentativas, checklists e grafo/lista de módulos.
3. Gerar rotas de gabarito a partir do front matter e interface de liberação compartilhada.
4. Implementar a tela “Seus dados”, importar/exportar e mensagens de privacidade.
5. Executar `pnpm check`, `pnpm test`, `pnpm build`, testes de imagem e Playwright/axe-core; registrar resultados reais no PR e em `estado.md`.

O PR permanece focado no M3 e ligado à issue #95. O merge ocorre somente quando todos os checks obrigatórios forem confirmados verdes no commit mais recente.
