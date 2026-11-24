# Relatório da Fase F — UC16 Remover Produto

| Campo | Valor |
|---|---|
| Caso de uso | UC16 — Remover Produto |
| Fase | F — Auditoria e encerramento |
| Período | 2026-11-24 |
| Responsável | evertonfoz |
| Issue(s) | #167 (fase), Epic #156 |
| PR | nenhum (aguardando autorização do estudante) |

## 1. O que foi feito
- Verificação final: build, lint, `pnpm test`, integração e e2e — Executado (`../evidencias/F/verificacao-final.txt`).
- Auditoria arquitetural, somente leitura, sem achados — Executado (`../evidencias/F/auditoria.md`, `auditoria.txt`).
- Conferência dos 24 nomes de teste da tabela de cobertura contra o código — Executado (`../evidencias/F/cobertura.md`): 24 encontrados, 0 ausentes.
- Regressão UC12 a UC15 nos testes unitários: 98 passam (`../evidencias/F/regressao.txt`); specs antigos só com acréscimos.
- Dependências: 0 chaves estrangeiras para `products.products` no banco de desenvolvimento, por consulta somente de leitura ao catálogo — Executado (`../evidencias/F/dependencias-fk.txt`).
- Teste de caracterização adicionado ao fechar a cobertura (repositório em memória não duplica) — Executado (`../evidencias/F/memoria-sem-duplicar.txt`).
- CI: **Aguardando evidência** (não há PR).

## 2. Resultados
| Verificação | Resultado |
|---|---|
| `pnpm build` | passa |
| `pnpm lint` | sem erros (avisos anteriores ao UC16) |
| `pnpm test` | 100 passam, 4 falham (`orders`, ADR-001) |
| `pnpm test:integration` | 24 passam |
| `pnpm test:e2e` | 25 passam, 1 falha (`orders`, ADR-001, já falhava sem o UC16) |
| `run-checks.sh --durability` (contêiner) | 59 ok, 0 falha (`../evidencias/E/run-checks.txt`) |

## 3. Gate de saída
| Verificação | Resultado | Validado por |
|---|---|---|
| Todo item do UC tem teste que o prova ou ADR | proposto: 15 *Coberto* e 4 *Não implementado* com ADR-008 a ADR-011 (ver `A.md`, seção 4) | pendente (estudante) |
| Arquitetura em conformidade, achados tratados | proposto: nenhum achado | pendente (estudante) |
| `state.yaml`, documentos e GitHub consistentes | `check-state.sh` e `check-links.mjs` passam localmente; `--remote` no encerramento | pendente |
| Issues e Epic fechados | não feito (sem merge) | pendente (estudante) |

## 4. Comparação com o esboço `excluir` (matriz de arquétipos, seção 3.3)
| Ponto do esboço | O que o UC16 mostrou |
|---|---|
| Fatias típicas: exclusão com sucesso (204), inexistente (404 ou 204), com dependências, lógica × física | Efetivas: sucesso, inexistente, já removido, falha de persistência, efeito nos outros UCs. Escolhas do UC: remoção **lógica**, `404` para inexistente e já removido (sem `204` idempotente), sem tratamento de dependências porque não há nenhuma (0 FK). "Já removido" e "efeito nos outros UCs" não estavam no esboço e viraram fatias. |
| Prova de durabilidade vira prova de ausência | Confirmado, em duas partes: a linha **continua** no banco com `deletedAt`, e a ausência é o `404` nas leituras (busca, listagem, alteração). O esboço não previa a segunda parte. |
| Verificações somente em banco de testes (regra de ações destrutivas) | **Não se aplicou do mesmo jeito:** a remoção é lógica, então nada é apagado. Os testes de integração e e2e usaram `celilac_test`; o `run-checks.sh` rodou no banco de desenvolvimento com autorização expressa, removendo só o produto que ele mesmo cria. Efeito colateral: cada execução deixa um registro removido que a API não desfaz (ADR-009, ADR-010). |
| Riscos: apagar dados reais; integridade referencial | Apagar dados reais: não ocorreu (remoção lógica). Integridade referencial: não exercitada, 0 FK. |
| A validar: política de remoção e idempotência (ADR obrigatória) | Política decidida pelo estudante; ADR-009 a ADR-011 registram o que ficou fora (restauração, remoção física, lote) e ADR-008 a autenticação. |
| Não previsto no esboço | (a) Contrato do Repository ganhou `removeActive` booleano (existiu/não existiu), pois o `save` em memória acrescenta; (b) concorrência virou requisito (CA12), resolvida com `UPDATE` único condicionado, diferente do UC15, que a adiou; (c) fatia que muda o contrato do Repository quebra o build do adaptador real se for integrada sozinha: foi preciso um método provisório e **PR único** (opção B, `pr_compartilhado`); (d) o aviso de RED que não falha funcionou em parte: F02 e F04 tiveram RED real, F03 e F05 foram caracterização. |
| Não exercitado | Remoção física, restauração, lote, cascata, `409` por dependência, `204` idempotente, autenticação, concorrência com duas requisições HTTP. |

**Proposta (não aplicada):** promover `excluir` de esboço a validado (UC16) em `method/playbooks/matriz-arquetipos.md` (seção 3.3) e acrescentar ao catálogo de fatias do guia de decomposição: "já removido", "efeito nos outros UCs" e a nota sobre fatias que mudam o contrato do Repository. Isto só se faz com a sua autorização expressa; não editei o método.

## 5. Pendências e riscos
- Sem push do PR, sem PR, sem merge, sem fechamento de issues e sem gates aprovados por mim. O roteiro está em `prompts/uc-16/artefatos/roteiro-conclusao-uc16.md`.
- Os arquivos `.http` não foram executados um a um; o contrato foi provado pelo `run-checks.sh`.
- CA11 e CA12 não têm cenário `.http` (CA14 parcial); são provados no banco de testes.
- O banco de desenvolvimento ganhou registros de teste (produtos criados e 2 removidos logicamente) das duas execuções do `run-checks.sh`.
