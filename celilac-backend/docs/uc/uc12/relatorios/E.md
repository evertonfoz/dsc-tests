# Relatório da Fase E — UC12 Cadastrar Produto

> Fatos e evidências, sem veredicto. Os gates abaixo aguardam a pessoa responsável (os que dependem de revisão humana) e o CI.

| Campo | Valor |
|---|---|
| Caso de uso | UC12 — Cadastrar Produto (arquétipo `criar`) |
| Fase | E — Verificação reprodutível |
| Período | 2026-11-20 |
| Responsável | evertonfoz |
| Issue(s) | #48; Epic do piloto #23 |
| Commit de referência | f8e1f68 (`main`) mais a branch da fase |

## 1. Objetivo da fase
Fazer cada linha do `contrato.md` ter cenário na coleção `.http` e asserção no script de verificação, provar a durabilidade e rodar o mesmo script no CI.

## 2. O que foi feito
- **Diagnóstico:** sete linhas do contrato sem cenário nem asserção (`docs/uc/uc12/evidencias/E/diagnostico.md`). *Executado nesta fase.*
- **Coleção:** cenários 6 a 11 acrescentados a `http-rest-client/containerizado/01-products-cadastrar-produto.http`.
- **Script:** 8 asserções acrescentadas ao `run-checks.sh` existente (nome em branco, 121 e 120 caracteres, JSON inválido, formato do 400, GET /products, rota inexistente). O limite de 120 grava um registro por execução, só pelo recurso do UC.
- **Controle negativo:** o script novo contra a API antiga (anterior ao C1b) falhou exatamente nos dois cenários que o C1b corrigiu.
- **Execução com a API reconstruída** (`docker compose up -d --build api`, banco preservado): 23 verificações OK, 0 falhas, incluindo durabilidade.

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | Linhas do contrato sem cobertura antes da fase | Executado nesta fase | `docs/uc/uc12/evidencias/E/diagnostico.md` |
| 2 | O script detecta código antigo (19 ok, 2 falhas) | Executado nesta fase | `docs/uc/uc12/evidencias/E/run-checks-controle-negativo.txt` |
| 3 | O script passa com o código atual (23 ok, 0 falhas) | Executado nesta fase | `docs/uc/uc12/evidencias/E/run-checks.txt` |
| 4 | O registro sobrevive ao reinício da API | Executado nesta fase | `docs/uc/uc12/evidencias/E/durabilidade.txt` |

## 4. Gate de saída
| Verificação | Como | Resultado | Validado por |
|---|---|---|---|
| Cada rota do contrato tem cenário na coleção | `contrato.md` × coleção | aprovado | evertonfoz |
| O script termina com 0 falhas em ambiente limpo | evidência 3 | aprovado | evertonfoz |
| O mesmo script passa no CI | job de smoke do PR | aprovado | CI |
| Durabilidade provada | evidência 4 | aprovado | evertonfoz |
| Nenhum segredo nos arquivos versionados | revisão do diff | aprovado | evertonfoz |

> Validação da fase E declarada pelo professor na sessão de 2026-11-20 ("Sim, valido a E"). O smoke do CI passou no PR #49. O agente não aprovou nenhum gate.

## 5. Pendências e riscos
- **"Ambiente limpo":** a execução foi na minha máquina, com o banco de desenvolvimento já existente e migrations sem pendências. Um clone limpo de verdade só é exercitado pelo job de smoke do CI (que sobe banco novo). Por isso o gate 2 não deve ser lido como prova de clone limpo sem o CI.
- O script grava registros no banco de desenvolvimento a cada execução (um por cenário de sucesso); não apaga nada.
- A coleção `.http` não é executada por ferramenta: a cobertura dela é conferida por leitura.
- Revisão solo e revisão de IA não são revisão independente.

## 6. Aprendizados
- Um script de verificação só vale depois de falhar contra o código errado (controle negativo).
- Inspecionar o que existe antes de criar evitou um segundo script paralelo.
