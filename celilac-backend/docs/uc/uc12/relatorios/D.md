# Relatório da Fase D — UC12 Cadastrar Produto

> Fatos e evidências. Os gates desta fase são objetivos e foram aferidos pelo CI.

| Campo | Valor |
|---|---|
| Caso de uso | UC12 — Cadastrar Produto (arquétipo `criar`) |
| Fase | D — Contrato da API |
| Período | 2026-11-20 |
| Responsável | evertonfoz |
| Issue(s) | #36 (D); Epic do piloto #23; #40, #41 e #42 abertas pelos achados |
| PR(s) | #37 (inventário), #44, #45, #46 |
| Commit de referência | e52d954 (`main`, após o merge do #46) |

## 1. Objetivo da fase
Documentar o contrato real de `POST /products` e resolver as divergências com o UC ou registrá-las em ADR.

## 2. O que foi feito
- **Inventário inicial** de 13 cenários contra o app completo e o banco de testes: achou nome só com espaços aceito (201), nome acima de 120 caracteres virando 500 e dois formatos de erro 400. *Executado nesta fase.*
- **Decisões do professor** (ADR-004 do projeto): formato único do 400 no estilo do ValidationPipe, nome em branco e nome acima de 120 rejeitados, campos extras ignorados.
- **Correções** em três entregas: F05 e F06 no núcleo (fase B reaberta) e C1b no DTO e no filtro (fase C reaberta).
- **Inventário final** repetido após o C1b: todos os 13 cenários coincidem com o alvo do `contrato.md`.

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | Contrato antes das correções (3 divergências) | Executado nesta fase | `docs/uc/uc12/evidencias/D/contrato-atual.txt` |
| 2 | Contrato depois do C1b (nenhuma divergência) | Executado nesta fase | `docs/uc/uc12/evidencias/D/contrato-final.txt` |
| 3 | Cada situação do contrato tem teste | Executado nesta fase | `src/modules/products/controllers/products.error-mapping.spec.ts` e `test/products/inventario-contrato.e2e-spec.ts` |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| Cada rota do UC tem sucesso e erros documentados e testados | `contrato.md` e evidência 2 | aprovado | CI |
| Divergências resolvidas ou com ADR | ADR-004 e PRs #44, #45, #46 | aprovado | CI |
| CI verde na branch principal | workflow, commit e52d954 | aprovado | CI |

> O agente não aprovou nenhum gate. As decisões de contrato foram do professor.

## 5. Pendências e riscos
- O inventário **registra** o contrato; a proteção contra regressão vem dos testes do `products.error-mapping.spec.ts`, não do inventário (ele só afirma a quantidade de cenários).
- Nome ausente, `null` ou não texto traz também a mensagem de `MaxLength` na lista. Status e formato corretos; ruído de mensagem aceito.
- Nome com caractere NUL ainda resulta em 500 (FE01 documentado); sem decisão do professor para criar regra.
- A configuração do `ValidationPipe` está em `main.ts` e é repetida nos testes (risco registrado na fase C).
- Teste instável #27 segue sem causa.
- Issues #36 e #23 abertas até fechamento autorizado.

## 6. Aprendizados
- Inventariar o contrato real antes de escrever contrato achou três divergências que o relatório de consistência afirmava cobertas.
- Uma divergência descoberta depois da fase B reabre a B (ADR-004 do método); o procedimento funcionou sem exceções.
- Repetir o inventário ao final é a prova mais barata de que o alvo foi atingido.
