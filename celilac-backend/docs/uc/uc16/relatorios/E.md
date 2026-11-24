# Relatório da Fase E — UC16 Remover Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC16 — Remover Produto |
| Fase | E — Verificação reprodutível |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | #166, Epic #156 |
| Branch | `feature/uc16-remover-produto` (PR único, `pr_compartilhado`) |

## 1. O que foi feito
- Cenários `.http`: `http-rest-client/containerizado/06-products-remover-produto.http` e `http-rest-client/products/uc16-remover-produto/test-scenarios.http` — Executado só como escrita; os arquivos `.http` **não foram executados um a um** (o contrato foi provado pelo `run-checks.sh`).
- `run-checks.sh`: 14 checagens novas do UC16 (produto próprio criado pelo script, `204` sem corpo, linha mantida com `deletedAt`, `404` na busca, alteração e segunda remoção, `deletedAt` preservado, total −1, outro produto intacto, `404`, `400` e sub-rota) — Executado.
- README do contêiner atualizado (volume de escrita e natureza lógica da remoção) — Documentado.
- Contêiner da API reconstruído (`docker compose up -d --build api`, só a API; banco não foi tocado), com autorização expressa do estudante — Executado.

## 2. Evidências
| # | Afirmação | Etiqueta | Evidência |
|---|---|---|---|
| 1 | Antes: a API em contêiner (sem o UC16) respondia `404` do framework a `DELETE /products/:productId` | Executado | `../evidencias/E/antes-rota-inexistente.txt` |
| 2 | 1ª execução: 58 ok e 1 falha, erro de comparação do meu script (`t` por `true`), não da API | Executado | `../evidencias/E/run-checks-1-erro-no-script.txt` |
| 3 | 2ª execução, `--durability`, com o script corrigido: 59 ok e 0 falha, incluindo as checagens de UC12 a UC15 (regressão, CA13) e as 14 do UC16 | Executado | `../evidencias/E/run-checks.txt` |

## 3. Desvios do método (registrados)
- **Erro do script** corrigido e a execução refeita; a saída da primeira ficou preservada.
- **Gravações no banco de desenvolvimento:** duas execuções gravaram, cada uma, 3 produtos criados, 1 renomeado e 1 removido logicamente. Como a remoção é lógica (ADR-010), os 2 registros removidos e os produtos de teste continuam na tabela. O script só remove o produto que ele mesmo criou.
- **CA14 (cada CA com teste e cenário `.http`):** CA11 (falha de gravação) e CA12 (remoções simultâneas) não têm cenário `.http` nem checagem no `run-checks.sh`; são provados no PostgreSQL de testes. CA06 (registro no banco) é conferido pelo `run-checks.sh` por consulta SQL, sem cenário `.http`. Isso fica declarado, não escondido.

## 4. Tabela de cobertura
Vigente em `A.md` (seção 4). Nesta fase a linha de regressão (RF08, CA13) passou a ter a evidência do `run-checks.sh`.

## 5. Gate de saída
Pendente: aprovação do estudante. Nenhum gate foi aprovado por mim.

## 6. Pendências e riscos
- O CI ainda não rodou no PR único (não há PR).
- Sem merge e sem fechamento de issues.
