# 04 — Tabela de cobertura inicial e ADR proposta (UC15)

> **Situação:** proposta. A estrutura de documentação (`docs/uc/uc15/relatorios/A.md`, `docs/adr/`) **só será criada com autorização** do estudante (3.5); até lá, esta tabela vive aqui e a situação é **Aguardando decisão** quanto ao local.
> Na Etapa 1 não há testes: nenhuma linha pode ser *Coberto*. Quando a Etapa 2 rodar, cada linha recebe o **nome exato do teste** (conferido no código) e a situação, só depois de executar.
> Situações: *Coberto*, *Parcial*, *A implementar*, *Não implementado* (com ADR) e *Aguardando decisão*.

## Tabela de cobertura inicial

| Item | Teste que prova | Situação |
|---|---|---|
| Fluxo principal (RF01, CA01, CA03) | — | A implementar |
| Resposta com exatamente `productId` e `name` (RF05, RN06, CA02) | — | A implementar |
| Atributos não alterados permanecem (RF06, RN01, CA04) | — | A implementar |
| FA01 — produto inexistente, `404` (RF03, CA05) | — | A implementar |
| FA02 — produto removido, `404` e não alterado (RN02, CA06) | — | A implementar |
| FA03 — identificador inválido, `400` (RF02, RN04, CA07) | — | A implementar |
| FA04 — nome inválido, `400`, nada gravado (RF04, RN03, RN05, CA08) | — | A implementar |
| FA05 — campo não alterável no corpo ignorado (RN01) | — | A implementar |
| FA06 — mesmo valor, `200` (RN07, CA09) | — | A implementar |
| FE01 — falha ao gravar, `500` e sem alteração parcial (RF07, CA10) | — | A implementar |
| RN08 — duas alterações em sequência, vale a última (CA11) | — | A implementar |
| Repositório em memória não duplica nem altera removido | — | A implementar |
| RF08 — UC12, UC13 e UC14 sem regressão (CA12) | — | A implementar |
| Concorrência real (alterações simultâneas) | nenhum | **Não implementado (ADR-006 proposta)** |
| Autenticação e permissões | nenhum | Não implementado (fora do escopo; sem ADR proposta, **pergunta aberta**: registrar ADR?) |
| Local da estrutura de documentação | — | Aguardando decisão |

## ADR-006 proposta — Controle de concorrência na alteração de produto adiado (UC15)

> Rascunho para o estudante. **Quem decide é o estudante**; o assistente só redige. Caminho previsto: `docs/adr/ADR-006-concorrencia-na-alteracao-de-produto-adiada-uc15.md`, com o modelo `method/templates/adr.md`.

- **Status:** Proposta
- **Data:** 2026-11-24
- **Decisores:** a definir (estudante)
- **Caso de uso:** UC15

### Contexto

A alteração muda um único atributo (`name`), e perder uma alteração simultânea tem custo baixo. Controlar a concorrência (por exemplo, com um número de versão do produto) exigiria atributo novo, migration e mudança de contrato.

### Decisão

Em alterações simultâneas do mesmo produto vale a **última gravação** (*last write wins*). Não há controle de versão nem bloqueio.

### Condição para retomar

Quando houver **mais de um atributo alterável**, ou quando passar a existir dado cuja perda de uma alteração tenha custo (por exemplo, preço, ADR-002). Nesse caso, criar um UC próprio de controle de concorrência.

### Consequências

- (+) UC simples, sem migration e sem mudança de contrato.
- (−) Uma alteração pode sobrescrever outra sem aviso.

### Alternativas consideradas

- **Bloqueio otimista com versão do produto** — descartada por ora: atributo novo, migration e contrato diferente para um ganho pequeno.
- **Bloqueio pessimista** — descartada: complexidade e custo desproporcionais.

## Pergunta aberta

Devo propor também uma ADR para "sem autenticação na alteração" (hoje herdada do UC14 sem ADR)? Sem resposta, mantenho como pergunta aberta.
