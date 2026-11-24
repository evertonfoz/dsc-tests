# Guia de decomposição de um caso de uso em fatias

> Usado na Fase A. Define o que é uma fatia, como cortar e como garantir que nada do caso de uso fique sem cobertura (ou sem decisão).

## 1. O que é uma fatia
Um **comportamento observável do caso de uso**, com regra, critério de aceite e teste RED nomeado. É a unidade de rastreio: uma issue, uma branch, um PR.

Uma fatia **não** é uma camada técnica ("criar o DTO", "implementar o controller") nem uma etapa do TDD ("escrever o teste").

## 2. Regras de corte
1. **Um comportamento por fatia.** Se a descrição precisa de "e" ligando dois comportamentos distintos, são duas fatias.
2. **Todo critério de aceite mapeia a uma fatia** (ou a uma decisão explícita, ver seção 4).
3. **Cada fatia tem um teste RED nomeado** antes de começar.
4. **Ordem:** caminho feliz → validações de entrada → regras de negócio → falhas de infraestrutura.
5. **Tamanho:** o PR deve poder ser revisado de uma vez. Como referência, até ~300 linhas de diff; se passar muito, corte de novo.
6. **Trabalho transversal não é fatia:** infraestrutura (Docker, CI) é Camada 0; documentação e verificação HTTP são fases. Não os transforme em fatias para "ter 5 sub-issues".
7. **Sem fatias artificiais.** Um UC pequeno pode ter 2 ou 3 fatias legítimas. Explique em vez de inflar.

## 3. Onde cada coisa acontece
| Fase | O que entrega |
|---|---|
| B (fatias) | O comportamento **no núcleo**: domínio + serviço de aplicação, com a porta de repositório e um adaptador em memória. Verificável por teste unitário. |
| C | Os **adaptadores**: fronteira HTTP (C1) e persistência real (C2), cada um em um PR cobrindo todas as fatias já integradas. |

## 4. Cobertura: de onde vem cada item do UC
Monte, na Fase A, uma tabela com **todos** os itens do `uc.md` (RF, RN, fluxos, CA). Cada linha termina em uma destas situações:

| Situação | Exigência |
|---|---|
| Coberto por fatia `Fxx` | o `state.yaml` lista o critério em `criterios` |
| Decisão: fora do escopo ou adiado | uma ADR curta com motivo, e o item vira `Aguardando decisão` no relatório da Fase F |
| Lacuna na especificação | pergunta registrada, `a confirmar` |

Na **Fase F** repete-se a tabela com a coluna **"teste que prova"** (nome do `it`) ou "não implementado (ADR-NNN)". Nada é declarado "coberto" sem teste.

## 4.1. Fatias descobertas depois
Se a Fase D, E ou F revelar um comportamento sem fatia, ele **não** vira exceção: a Fase B é reaberta e a fatia segue o ciclo normal. Procedimento no `state.yaml` e no relatório: `method/decisoes/ADR-004-retorno-a-fase-anterior.md`.

## 5. Catálogo de fatias típicas — arquétipo `criar`
| # | Fatia típica | Costuma cobrir |
|---|---|---|
| 1 | Criação com dados válidos | fluxo principal, RF de cadastro, CA de sucesso |
| 2 | Rejeição por campo obrigatório ausente/vazio | FA de campo obrigatório, CA de rejeição |
| 3 | Rejeição por valor inválido (formato, faixa) | FA de valor inválido, RN de validação |
| 4 | Garantia de que o inválido não é persistido | RN de integridade, CA de não armazenamento |
| 5 | Regra de unicidade ou de negócio específica | RN própria do UC (se o UC a define) |
| 6 | Falha de persistência tratada | FE de falha de infraestrutura |

*Os demais arquétipos têm catálogos em `matriz-arquetipos.md` (esboços).*

## 5.1. Catálogo de fatias típicas — arquétipo `atualizar` (validado no UC15)

| Fatia | Comportamento | Prova |
|---|---|---|
| F01 | Atualização válida: grava o novo valor e devolve o item atualizado; atributos não alterados permanecem | Teste do Service com Repository em memória; releitura |
| F02 | Item inexistente lança a exceção de "não encontrado" | Teste do Service |
| F03 | Item removido logicamente é tratado como inexistente e **não é alterado** | Teste do Service e do PostgreSQL de testes |
| F04 | Valor inválido lança a exceção de validação **sem chamar o Repository** | Teste do Service (releitura do valor anterior) |
| F05 | Falha de persistência lança a exceção de falha, sem expor a causa e sem alteração parcial | Teste do Service e falha real do PostgreSQL |

Fases C1 (rota, DTO, pipe do identificador, mapeamento de erros) e C2 (atualização atômica) seguem como no `criar`. **Cuidado com o RED:** se o GREEN da F01 já inclui "não encontrado" e a tradução de falha, F02, F03 e F05 nascem sem RED; escreva o mínimo na F01 (UC15: isso não foi feito).

## 6. Exemplo retrospectivo: o UC12 (CeliLac)
> Reconstrução didática **depois do fato**. A decomposição abaixo é uma **hipótese** de como o UC12 poderia ter sido cortado; o estado das fatias é **Confirmado no código** em 2026-11-20.

| Fatia | Critérios/regras | Estado no código |
|---|---|---|
| F01 Cadastro com dados válidos | CA01, RF01, RF03 | Implementada: teste de serviço, de controller e de integração |
| F02 Rejeitar nome vazio | RN01, FA01, CA02 | Implementada: `@IsNotEmpty()` + testes HTTP |
| F03 Inválido não é persistido | RN03, RN04, CA03 | Verificada na fronteira HTTP (serviço não é chamado) |
| F04 Rejeitar preço inválido | RN02, FA02 | **Não implementada**: não existe campo de preço em `Product` nem no DTO |
| F05 Falha de persistência tratada | FE01 | **Sem teste** encontrado |

**Lição de cobertura.** O relatório `01-12` declarou 100% de cobertura das regras RN01–RN04, citando "preço positivo". O código tem apenas `name`. O próprio `uc-12.md` diz que a validação de preço é "ilustrativa" e que seus valores não estão definidos, então **não implementá-la pode ser uma decisão legítima**. O problema está em tê-la declarado como coberta sem uma decisão registrada. Além disso, o roteiro `12-10` lista um `CA05` que não existe no `uc-12.md` (que tem CA01 a CA04).

Com este método, F04 e F05 teriam, ao fim da Fase F, ou um teste que as prove, ou uma ADR dizendo "adiado/fora de escopo, motivo".
