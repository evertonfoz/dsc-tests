# 06 — Piloto: reconciliando o UC12 Cadastrar Produto

> **Público:** estudantes que vão conduzir um caso de uso com o método e quem for ensiná-lo.
> **Objetivo:** ver o método aplicado a um caso real do começo ao fim, o que ele encontrou, onde precisou ser corrigido e o que se aprende com isso.
> **Pré-requisitos:** documentos 01 a 05.

---

## 1. O que foi o piloto
O UC12 já tinha sido executado no laboratório, organizado **por camada técnica** (serviço, HTTP, testes, banco). O piloto o **reconciliou** com o método: itens do UC mapeados a fatias, decisões registradas, evidências refeitas. Nada foi apagado; o que existia foi reorganizado e conferido. Tudo o que segue está no repositório do curso: `docs/uc/uc12/state.yaml`, relatórios `A` a `F`, evidências e ADRs. <!-- links:ignore -->

| Fase | Entrega principal | Pull requests |
|---|---|---|
| A | Cobertura item a item, decisões do professor, novas fatias F03 e F04 | issues #23, #24 e #25 (sem PR de código) |
| B | F03 nome vazio no núcleo; F04 falha de persistência | #26, #31 |
| C | C1 mapeamento HTTP dos erros; C2 persistência real e migration | #34, #35 |
| D | Inventário do contrato real e ADR-004 do projeto | #37, #47 |
| B e C reabertas | F05 nome em branco; F06 nome acima de 120; C1b DTO e formato do 400 | #44, #45, #46 |
| E | 8 asserções e 6 cenários novos, durabilidade | #49 |
| F | Cobertura real, auditoria, achados A2 e A7 | #50, #51, #52, #53, #54 |

## 2. Cinco coisas que o método descobriu
1. **"100% coberto" era falso.** O relatório de consistência afirmava cobertura das regras de nome e preço. O código só tinha o campo `name`; o preço nunca existiu. Decisão do professor: adiar com a **ADR-002**, em vez de inventar uma regra que o UC chama de "ilustrativa".
2. **O núcleo aceitava nome vazio.** A regra só existia no DTO. A fatia F03 levou a regra para o serviço, onde ela pertence.
3. **A falha de persistência (FE01) não tinha teste.** A fatia F04 criou o erro de domínio, e a fase C provou o comportamento **contra o banco real**.
4. **O contrato real tinha três divergências.** Ao inventariar `POST /products` na fase D: nome só com espaços dava 201, nome com 121 caracteres dava 500 e havia dois formatos de erro 400. Ninguém tinha olhado, porque ninguém tinha *executado* para ver.
5. **Um rótulo existia em dois sentidos.** "CA05" aparecia em um roteiro, mas o `uc-12.md` só vai até CA04.

## 3. Onde o método precisou ser corrigido
**Fatias descobertas depois da fase B.** O inventário da fase D gerou duas fatias novas (F05 e F06). O método não dizia o que fazer. Em vez de improvisar, criamos a **ADR-004 do método**: uma fatia descoberta depois da B **reabre a B**; as fases seguintes mantêm o status e voltam a ter gates pendentes. O validador do `state.yaml` passou a aceitar o caso e um teste o protege.

**Lição:** um método que não admite voltar atrás esconde o retrabalho. O mais seguro é torná-lo **visível e barato**.

## 4. Erros nossos, registrados
O piloto também errou, e os erros viraram regras:

| O que aconteceu | O que aprendemos |
|---|---|
| Caminhos de evidência sem o prefixo `docs/uc/<uc>/` quebraram o `check-links` em mais de um PR | Rodar os validadores **antes** do commit e conferir o código de saída (um `tail` no fim do pipe escondia a falha) |
| Um `sed` mexeu em evidências antigas | Edição de evidência é suspeita; usar script com `assert` e revisar o diff |
| Um teste passou de primeira | Sem uma **mutação** que o derrube, ele pode não provar nada. Fizemos mutação em F04, FE01 e A7 |
| Uma falha intermitente (#27) apareceu só ao repetir a suíte | Registrar com número de ocorrências evita culpar a fatia errada |
| O nome "integração" escondia um repositório em memória | O nome do arquivo não prova o nível do teste |

## 5. O que significou "gate aprovado"
Gates **objetivos** (CI verde, `check-state --remote`) são aprovados por `CI`. Gates que pedem julgamento (cobertura, arquitetura, fechar o Epic) são aprovados por **uma pessoa**. O agente de IA nunca aprovou nenhum. Houve momentos em que o professor delegou revisões ao agente; isso foi registrado como **revisão de IA, não independente**, e aparece assim nos relatórios.

## 6. O ciclo de uma fatia, em exemplo
F06, "nome com mais de 120 caracteres é rejeitado no núcleo":
1. Issue com teste RED nomeado.
2. Commit **RED**: o teste falha pelo motivo certo (`docs/uc/uc12/evidencias/B/f06-red.txt`). <!-- links:ignore -->
3. Commit **GREEN**: o mínimo para passar (`f06-green.txt`).
4. PR único, CI verde, integração.

O C1b repetiu o ciclo na fronteira HTTP e acrescentou um **REFACTOR** em commit separado: a constante `MAX_PRODUCT_NAME_LENGTH` passou a ser compartilhada entre serviço e DTO. Comportamento igual, suíte verde antes e depois.

## 7. Limites do que o piloto prova
- Foi **um** UC do arquétipo `criar`. Consultar, atualizar, excluir e autenticar seguem como esboços na `matriz-arquetipos.md`.
- As revisões foram solo ou de IA. Uma turma real ganha revisão independente.
- A execução da fase E usou o banco de desenvolvimento da máquina; o clone limpo de verdade é o job de smoke do CI.
- O teste instável #27 continua sem causa.
- O caractere NUL no nome ainda resulta em 500 (decisão: manter como FE01).

## 8. Exercícios
1. Pegue um relatório seu que afirme "tudo coberto". Refaça a tabela com o nome exato do teste e rode-o. O que sobra sem teste e sem decisão?
2. Escolha um endpoint seu e **inventarie** o contrato real (status e corpo para cinco entradas ruins). Alguma resposta surpreende?
3. Explique, com suas palavras, por que descobrir uma fatia depois da fase B reabre a B, e não cria um atalho.
4. Escreva um teste que passa de primeira e proponha uma mutação que o derrube. Se nada o derruba, o que ele prova?
5. Qual gate do seu projeto deveria ser de `CI` e qual deveria ser de uma pessoa? Justifique.

## 9. Referências
- `docs/uc/uc12/state.yaml` · `docs/uc/uc12/relatorios/` · `docs/uc/uc12/evidencias/F/cobertura.md` · `docs/uc/uc12/evidencias/F/auditoria.md` (UC12 do CeliLac, no repositório do curso) <!-- links:ignore -->
- `docs/adr/ADR-002-validacao-de-preco-adiada-uc12.md` · `docs/adr/ADR-004-contrato-de-erros-e-validacao-de-nome-uc12.md` (UC12 do CeliLac, no repositório do curso) <!-- links:ignore -->
- `method/decisoes/ADR-004-retorno-a-fase-anterior.md`

Próximo documento: **07 — Conduzindo o seu caso de uso** (orquestrador do estudante).
