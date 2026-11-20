# Matriz de aplicabilidade por arquétipo de caso de uso

> **Grau de validação.** Só o arquétipo **criar** foi exercitado em prática (UC12 / CeliLac). Os demais são **esboços**: hipóteses fundamentadas no que cada tipo costuma exigir, **ainda não executadas**. Cada esboço deve ser validado no primeiro caso de uso real daquele tipo e então promovido (ou corrigido) com evidências.
> Legenda: `=` igual ao `criar` · `±` muda parcialmente (ver nota) · `+` fase ganha passos · `−` fase simplificada.

## 1. Visão geral por fase

| Fase | criar *(validado)* | consultar *(esboço)* | atualizar *(esboço)* | excluir *(esboço)* | autenticar *(esboço)* |
|---|---|---|---|---|---|
| **A** Planejar e publicar | referência | = | = | = | + segurança como item de planejamento |
| **B** Fatias (núcleo) | ver seção 2 | ± fatias de leitura (sem efeito colateral) | + estado anterior e conflitos | + integridade e política de remoção | + hash, política de credenciais |
| **C1** Fronteira HTTP | `POST`, 201/400 | `GET`, 200/404, parâmetros e filtros | `PUT`/`PATCH`, 200/404/409 | `DELETE`, 204/404 | `POST` de login, 200/401, sem vazar detalhes |
| **C2** Persistência real | gravar e reler | + consultas, índices, paginação | + atualização, concorrência | + remoção física ou lógica, integridade referencial | + armazenamento seguro de credenciais |
| **D** Contrato de resposta | DTO de resposta, não exposição | **peso maior**: formato de lista, paginação, campos | ± | − (corpo costuma ser vazio) | **peso maior**: o que nunca sai na resposta |
| **E** Verificação reprodutível | cadastro + durabilidade | leitura de dado conhecido; sem durabilidade a provar | alteração + releitura | remoção + confirmação de ausência | login válido/inválido; sem registrar segredos |
| **F** Auditoria e encerramento | = | = | = | = | + revisão de segurança dedicada |

## 2. Arquétipo `criar` — validado (UC12)

| Aspecto | Conteúdo |
|---|---|
| Catálogo de fatias | ver `guia-decomposicao-em-fatias.md`, seção 5 |
| Resposta de sucesso | `201 Created` com DTO público |
| Erros típicos | `400` (entrada inválida); `409` se houver unicidade |
| Prova de persistência | consulta SQL de leitura antes e depois de reiniciar **só a API** |
| Atenção | cobertura **real** de RN/FA/FE na Fase F (lição do UC12) |

## 3. Esboços dos demais arquétipos

### 3.1. `consultar` *(esboço)*
- **Fatias típicas:** consulta de item existente (200); item inexistente (404); identificador malformado (400); listagem vazia; listagem com dados; filtro; paginação/ordenação (se o UC definir).
- **Muda:** não há escrita, então "inválido não é persistido" não se aplica; a fase E não precisa de prova de durabilidade, mas precisa de **dado conhecido** (semente de teste) para as asserções.
- **Riscos:** consulta sem limite; vazar campos internos (Fase D).
- **A validar:** como semear dados de forma isolada (banco de testes).

### 3.2. `atualizar` *(esboço)*
- **Fatias típicas:** atualização válida; recurso inexistente (404); entrada inválida (400); atualização parcial vs. total; conflito/concorrência (409), se o UC definir; imutabilidade de campos.
- **Muda:** o teste RED parte de um **estado anterior**; a fase C2 precisa de teste de reescrita sem perda de campos não enviados.
- **Riscos:** sobrescrever campos; falta de controle de concorrência.
- **A validar:** se `PUT` vs. `PATCH` vem do UC ou de decisão da equipe (ADR).

### 3.3. `excluir` *(esboço)*
- **Fatias típicas:** exclusão de item existente (204); inexistente (404 ou 204 idempotente — decisão do UC); item com dependências (409 ou cascata — decisão); exclusão lógica vs. física.
- **Muda:** a prova de durabilidade vira **prova de ausência**; ações destrutivas ganham atenção redobrada (regra 8 do `AGENTS.md`): verificações **somente** em banco de testes.
- **Riscos:** apagar dados reais; integridade referencial.
- **A validar:** política de remoção e idempotência (ADR obrigatória).

### 3.4. `autenticar` *(esboço)*
- **Fatias típicas:** credenciais válidas; inválidas (401 sem revelar qual campo falhou); usuário inexistente (mesma resposta do anterior); bloqueio/limite de tentativas (se o UC definir); emissão e expiração de token.
- **Muda:** segurança passa a ser requisito de primeira classe: armazenamento de credenciais, segredos fora do repositório e dos relatórios, mensagens de erro uniformes. A Fase F inclui revisão de segurança.
- **Riscos:** vazamento de segredos em logs/evidências; enumeração de usuários.
- **A validar:** o que as evidências podem registrar sem expor segredos (regra 10 do `AGENTS.md`).

## 4. Como promover um esboço a "validado"
1. Executar um UC real do arquétipo seguindo o playbook.
2. Registrar o que foi diferente do esboço (ADR ou nota no relatório da Fase F).
3. Atualizar esta matriz: trocar *esboço* por *validado (UCxx)*, com evidências.
4. Atualizar o catálogo de fatias do arquétipo no guia de decomposição.
