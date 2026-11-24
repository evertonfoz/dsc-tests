# 04 — Tabela de cobertura inicial e ADRs propostas (UC16)

> **Situação:** proposta. A estrutura de documentação (`docs/uc/uc16/relatorios/A.md`, `docs/adr/`) **só será criada com autorização** do estudante (3.5); até lá, esta tabela vive aqui e a situação é **Aguardando decisão** quanto ao local.
> Na Etapa 1 não há testes: nenhuma linha pode ser *Coberto*. Quando a Etapa 2 rodar, cada linha recebe o **nome exato do teste** (conferido no código) e a situação, só depois de executar.
> Situações: *Coberto*, *Parcial*, *A implementar*, *Não implementado* (com ADR) e *Aguardando decisão*.

## Tabela de cobertura inicial

| Item | Teste que prova | Situação |
|---|---|---|
| Fluxo principal: `204` sem corpo (RF01, RF04, RN09, CA01) | — | A implementar |
| Produto removido continua no banco com `deletedAt` e os mesmos `productId` e `name` (RN01, CA06) | — | A implementar |
| Busca responde `404` depois da remoção (RF05, RN03, CA02) | — | A implementar |
| Listagem não traz o produto e o total diminui em 1 (RF05, RN03, CA03) | — | A implementar |
| Alteração responde `404` e não altera (RF05, RN03, CA04) | — | A implementar |
| Só o produto alvo é afetado (RF07, RN06, CA05) | — | A implementar |
| FA01 — produto inexistente, `404` (RF03, RN02, CA07) | — | A implementar |
| FA02 — produto já removido, `404` e `deletedAt` preservado (RF03, RN07, CA08) | — | A implementar |
| FA03 — identificador inválido, `400` (RF02, RN04, CA09) | — | A implementar |
| FA04 — corpo ignorado (CA10) | — | A implementar |
| FE01 — falha ao gravar, `500` e produto continua ativo (RF06, RN05, CA11) | — | A implementar |
| RN08 — remoções simultâneas: um `204` e um `404` (CA12) | — | A implementar |
| Repositório em memória reproduz o banco (removido ou inexistente: nada removido; não duplica) | — | A implementar |
| RF08 — UC12 a UC15 sem regressão, exceto o efeito de RF05 (CA13) | — | A implementar |
| Autenticação e permissões | nenhum | **Não implementado (ADR-008 proposta)** |
| Restauração de produto removido | nenhum | **Não implementado (ADR-009 proposta)** |
| Remoção física (*purge*) de produtos já removidos | nenhum | **Não implementado (ADR-010 proposta)** |
| Remoção em lote | nenhum | **Não implementado (ADR-011 proposta)** |
| Dependências de outras entidades | — | A implementar (confirmar no banco que não há chave estrangeira para `products`) |
| Local da estrutura de documentação | — | Aguardando decisão |

**Sem ADR de concorrência.** Diferente da alteração (ADR-006), a regra RN08 **não é adiada**: ela é implementada (instrução única condicionada ao produto ativo) e provada por teste. Se o teste no banco de testes mostrar que ela não se sustenta, o item passa a **Parcial** ou **Não implementado** com ADR.

**Sem ADR de política.** A remoção lógica reaproveita a decisão da ADR-005 e não muda nenhuma decisão anterior. Se o estudante trocar para remoção física, uma ADR própria passa a ser necessária.

## Rascunhos das ADRs

> Rascunhos para o estudante. **Quem decide é o estudante**; o assistente só redige. Caminho previsto: `docs/adr/ADR-0NN-<titulo>.md`, com o modelo `method/templates/adr.md`. Data de redação: 2026-11-24.

### ADR-008 proposta — Remoção de produto sem autenticação por enquanto (UC16)

- **Status:** Proposta · **Decisores:** a definir (estudante) · **Caso de uso:** UC16

**Contexto.** O projeto não tem autenticação (ADR-007). Diferente da alteração, a remoção **tira o produto de circulação**: qualquer cliente que conheça um `productId` pode removê-lo. Como a remoção é lógica, o registro é preservado, mas fica inacessível pela API.

**Decisão.** `DELETE /products/:productId` é público por enquanto, sem autenticação nem permissões.

**Condição para retomar.** Quando o projeto introduzir autenticação (UC próprio). A remoção deve então passar a exigir permissão, e vale rever a ordem: a remoção deveria ser das primeiras operações protegidas.

**Consequências.**
- (+) UC simples e coerente com os UCs 12 a 15.
- (−) Qualquer cliente da API pode remover produtos; adequado apenas ao ambiente didático atual.

**Alternativas consideradas.**
- Exigir autenticação já no UC16 — descartada: o projeto não tem o mecanismo, e criá-lo é outro UC.

### ADR-009 proposta — Restauração de produto removido fora do UC16

- **Status:** Proposta · **Decisores:** a definir (estudante) · **Caso de uso:** UC16

**Contexto.** Como a remoção é lógica, seria possível desfazê-la. A especificação não pede isso, e restaurar mistura duas operações em um caso de uso.

**Decisão.** A restauração está **excluída** do UC16. Um produto removido só volta a existir por UC próprio.

**Condição para retomar.** Um UC de restauração, se um dia for especificado (decidir também se um produto removido pode ser restaurado depois de outro cadastrado com o mesmo nome).

**Consequências.**
- (+) O UC16 fica pequeno e verificável.
- (−) Quem precisar desfazer uma remoção terá de esperar outro UC (ou mexer direto no banco).

**Alternativas consideradas.**
- Restaurar ao cadastrar de novo — descartada: mistura operações e muda o UC12.

### ADR-010 proposta — Remoção física (*purge*) de produtos removidos fora do UC16

- **Status:** Proposta · **Decisores:** a definir (estudante) · **Caso de uso:** UC16

**Contexto.** Os registros removidos continuam no banco. Apagá-los de vez perde histórico e exigiria tratar integridade referencial caso, no futuro, outras entidades referenciem produtos.

**Decisão.** O *purge* está **excluído** do UC16.

**Condição para retomar.** Necessidade de liberar espaço, exigência legal de apagar dados ou política de retenção definida, em UC próprio.

**Consequências.**
- (+) Nenhum dado é perdido por esta operação.
- (−) O banco acumula registros removidos.

**Alternativas consideradas.**
- Remoção física já no UC16 — descartada: irreversível e muda o que os UCs 13 a 15 assumem sobre produto removido.

### ADR-011 proposta — Remoção em lote fora do UC16

- **Status:** Proposta · **Decisores:** a definir (estudante) · **Caso de uso:** UC16

**Contexto.** Remover vários produtos de uma vez traz perguntas próprias: tudo ou nada, resposta parcial, limite de itens.

**Decisão.** A remoção em lote está **excluída** do UC16.

**Condição para retomar.** Um UC próprio, se um dia for especificado.

**Consequências.**
- (+) O UC16 trata um produto por vez, com contrato simples.
- (−) Remover muitos produtos exige várias chamadas.

**Alternativas consideradas.**
- `DELETE` com lista de identificadores — descartada: contrato e erros parciais fora do escopo.

## Pergunta aberta

Quer manter as **quatro** ADRs (008 a 011) ou agrupar as três de escopo (009 a 011) em uma só? O método pede uma ADR por decisão; agrupar economiza arquivos, mas mistura condições para retomar diferentes.
