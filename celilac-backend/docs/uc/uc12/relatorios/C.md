# Relatório da Fase C — UC12 Cadastrar Produto

> Fatos e evidências. Os gates desta fase são objetivos e foram aferidos pelo CI.

| Campo | Valor |
|---|---|
| Caso de uso | UC12 — Cadastrar Produto (arquétipo `criar`) |
| Fase | C — Adaptadores (C1 HTTP, C2 persistência) |
| Período | 2026-11-20 |
| Responsável | evertonfoz |
| Issue(s) | #32 (C1), #33 (C2); Epic do piloto #23 |
| PR(s) | #34 (C1), #35 (C2) |
| Commit de referência | 3a65d7f (`main`, após o merge do #35) |

## 1. Objetivo da fase
Expor na fronteira HTTP os erros do núcleo e provar a persistência real, um PR por adaptador.

## 2. O que foi feito
- **C1:** `InvalidProductNameException` → 400 e `ProductPersistenceFailedException` → 500 no `DomainHttpExceptionFilter`, com corpo seguro (ADR-003). RED e GREEN em commits separados. *Executado nesta fase.*
- **C2:** teste de FE01 contra o banco de testes real (nome de 121 caracteres, `varchar(120)`), sem vazar a mensagem do banco; migrations em banco vazio evidenciadas pelo log do CI. *Executado nesta fase.* O teste é de **caracterização** (não houve RED, o comportamento já existia); a mutação provou que ele detecta a regressão.
- O repositório TypeORM, a migration `CreateProductsTable` e o teste de gravar e reler já existiam (laboratório) e foram reconciliados, não reescritos. *Confirmado no código.*

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | RED do C1: ambos os erros viravam 500 genérico | Executado nesta fase | `docs/uc/uc12/evidencias/C/c1-red.txt` |
| 2 | GREEN do C1: 10 testes de `products` passam | Executado nesta fase | `docs/uc/uc12/evidencias/C/c1-green.txt` |
| 3 | FE01 com banco real | Executado nesta fase | `docs/uc/uc12/evidencias/C/c2-fe01-caracterizacao.txt` |
| 4 | Mutação derruba o teste com o erro real do banco | Executado nesta fase | `docs/uc/uc12/evidencias/C/c2-fe01-mutacao.txt` |
| 5 | 3 migrations executadas em banco vazio (log do CI) | Executado nesta fase | `docs/uc/uc12/evidencias/C/c2-migration-banco-vazio.txt` |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| C1 integrada com mapeamento dos erros | PR #34, CI | aprovado | CI |
| C2 integrada, migration verificada em banco vazio | PR #35, evidência 5 | aprovado | CI |
| CI verde na branch principal | workflow do GitHub | aprovado | CI |

> Validação humana: autorização do professor na sessão (2026-11-20) para integrar #34 e #35 e abrir a fase D. O agente não aprovou nenhum gate.

## 5. Decisões e hipóteses
- Status 400 e 500: ADR-003 (professor).
- Banco com histórico: verificado na Fundação (PR #22), não repetido aqui.

## 6. Pendências e riscos
- **Achados que abriram trabalho na Fase D:** nome só com espaços aceito (201), nome acima de 120 vira 500, dois formatos de erro 400 (ver `docs/uc/uc12/evidencias/D/contrato-atual.txt` e ADR-004).
- Issues #32 e #33 abertas até fechamento autorizado.
- O E2E e os testes que sobem o app precisam repetir à mão a configuração do `ValidationPipe`, que está em `main.ts` e não no `AppModule`. Se `main.ts` mudar, o teste não percebe.

## 7. Aprendizados
- Um teste que passa de primeira só é útil depois de uma mutação que o derrube.
- Evidência de "banco vazio" pode vir do CI, sem `DROP`.

## 8. Reabertura (2026-11-20)
A fase C foi reaberta para o C1b (#42): DTO rejeitando nome em branco e nome acima de 120 caracteres, e formato único do erro 400 (ADR-004 do projeto). Os gates de C1 e C2 continuam aprovados; entram dois gates novos, pendentes. Dependência: F05 e F06 integradas.

**Fechamento (2026-11-20):** C1b integrada pelo PR #46 (RED, GREEN e REFACTOR em commits separados; evidências `c1b-red.txt`, `c1b-green.txt`, `c1b-refactor.txt`). CI verde na `main` no commit e52d954. Gates aprovados por CI.
