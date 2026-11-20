# Relatório da Fase <A–F> — <UC> <Nome>

> Máximo ~2 páginas. Fatos e evidências, sem veredicto: quem aprova é a pessoa responsável ou o CI.
> Saídas brutas de comandos ficam em `evidencias/`; aqui apenas se aponta para elas.

| Campo | Valor |
|---|---|
| Caso de uso | <UC — Nome> |
| Fase | <letra e nome> |
| Período | <início → fim> |
| Responsável | <login> |
| Issue(s) | <#N> |
| Branch / PR | <branch> / <#N> |
| Commit de referência | <hash completo, obtido com git rev-parse HEAD> |

## 1. Objetivo da fase
<1–3 frases.>

## 2. O que foi feito
<Lista curta de ações. Cada item com a etiqueta: Documentado · Confirmado no código · Executado nesta fase · Aguardando evidência · Pendente de correção.>

## 3. Evidências
| # | Afirmação | Etiqueta | Evidência (arquivo em `evidencias/`) |
|---|---|---|---|
| 1 | | Executado nesta fase | `evidencias/<fase>/<arquivo>` |

## 4. Gate de saída
| Verificação | Como verificar | Resultado | Validado por |
|---|---|---|---|
| | <comando ou documento> | pendente / aprovado / reprovado | <pessoa ou CI> |

## 5. Decisões e hipóteses
<Decisões viram ADR (`method/templates/adr.md`). Hipóteses precisam de confirmação: liste.>

## 6. Pendências e riscos
<O que ficou aberto, com responsável.>

## 7. Aprendizados (opcional, para fins didáticos)
<O que esta fase ensinou ou o que surpreendeu.>
