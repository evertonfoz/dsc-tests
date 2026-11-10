# Artefato 07 — Plano de Atualização Operacional do GitHub

## 1. Objetivo do Plano

Este artefato estabelece o roteiro operacional passo a passo para que a equipe de estudantes aplique e formalize no GitHub todas as decisões de governança, atribuição de responsabilidades, revisão cruzada e aplicação da Definition of Ready desenvolvidas nesta etapa.

---

## 2. Etapas Operacionais de Atualização no Repositório

### Etapa 1: Conferência de Integridade das Issues
1. Acessar a aba **Issues** do repositório no GitHub.
2. Certificar-se da existência formal da Issue Principal (Épico):
   - `[UC12] Cadastrar Produto`
3. Verificar se as 6 Sub-Issues encontram-se devidamente cadastradas com os identificadores padronizados:
   - `[SUB-01]` Modelar a Entidade de Domínio Product e Invariantes
   - `[SUB-02]` Implementar DTOs de Entrada e Saída com Validações de Contrato
   - `[SUB-03]` Configurar Persistência, Schema de Banco e Repositório de Produtos
   - `[SUB-04]` Implementar o Serviço de Aplicação para Cadastro de Produto
   - `[SUB-05]` Implementar o Controlador HTTP e Rota POST /products
   - `[SUB-06]` Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)

---

### Etapa 2: Atualização Formal dos Responsáveis (*Assignees*)
No painel lateral direito de cada Sub-Issue (*Assignees*), vincular o usuário GitHub oficial do responsável:

- **`[SUB-01]`**: Atribuir a `@anasilva-dev`
- **`[SUB-02]`**: Atribuir a `@carlamendes-qa`
- **`[SUB-03]`**: Atribuir a `@brunosouza-tech`
- **`[SUB-04]`**: Atribuir a `@anasilva-dev`
- **`[SUB-05]`**: Atribuir a `@brunosouza-tech`
- **`[SUB-06]`**: Atribuir a `@carlamendes-qa`

*Nota:* Na Issue Principal (Épico), manter a atribuição conjunta de toda a equipe ou designar o Coordenador (`@brunosouza-tech`) e Tech Lead (`@anasilva-dev`).

---

### Etapa 3: Registro Oficial dos Revisores de Planejamento (*Reviewers*)
Como o campo nativo de *Reviewers* do GitHub é exclusivo para Pull Requests, o registro dos revisores de Issues deve ser formalizado de duas formas complementares:
1. **No corpo da Issue:** Adicionar uma linha destacada logo abaixo do título:
   - `**Revisor de Planejamento Designado:** @username`
2. **Nos comentários da Issue:** Publicar o comentário inicial mencionando o revisor com `@` para notificação automática.

Mapeamento formal dos revisores:
- Em `[SUB-01]`: Mencionar e registrar `@brunosouza-tech`
- Em `[SUB-02]`: Mencionar e registrar `@anasilva-dev`
- Em `[SUB-03]`: Mencionar e registrar `@carlamendes-qa`
- Em `[SUB-04]`: Mencionar e registrar `@brunosouza-tech`
- Em `[SUB-05]`: Mencionar e registrar `@carlamendes-qa`
- Em `[SUB-06]`: Mencionar e registrar `@anasilva-dev`

---

### Etapa 4: Publicação dos Comentários Técnicos de Revisão
Cada revisor designado deve acessar a respectiva Sub-Issue e colar o comentário técnico estruturado gerado no **Artefato 05**:
- Bruno cola o comentário de pré-revisão em `SUB-01` e `SUB-04`.
- Ana cola o comentário de pré-revisão em `SUB-02` e `SUB-06`.
- Carla cola o comentário de pré-revisão em `SUB-03` e `SUB-05`.

---

### Etapa 5: Aplicação dos Ajustes de Descrição nas Sub-Issues
Os responsáveis (*Assignees*) devem editar a descrição principal da sua Sub-Issue no GitHub aplicando os refinamentos técnicos acordados:
- **`SUB-01`**: Incluir especificação do Factory Method com geração de UUID e regra de tamanho mínimo do nome.
- **`SUB-02`**: Adicionar `@Transform` para sanitização de espaços e `@MaxLength(150)` no nome.
- **`SUB-03`**: Esclarecer mapeamento do tipo `decimal(10,2)` no TypeORM e transformer numérico.
- **`SUB-04`**: Documentar convenção de tratamento de exceções de domínio/aplicação e atomicidade.
- **`SUB-05`**: Documentar status da rota pública no MVP e ponto de extensão para guards de autorização.
- **`SUB-06`**: Documentar política de isolamento e truncagem da base de dados PostgreSQL para os testes E2E.

---

### Etapa 6: Governança de Estados no GitHub Project (Board Kanban)

1. **Adesão Estrita ao Fluxo Padrão de 5 Estados:**
   O GitHub Project da equipe deve manter exclusivamente as seguintes colunas/valores no campo `Status`:
   $$\text{Backlog} \longrightarrow \text{Ready} \longrightarrow \text{In Progress} \longrightarrow \text{In Review} \longrightarrow \text{Done}$$

2. **Posicionamento Inicial das Issues no Board:**
   - **Issue Principal (Epic):** Deve permanecer na coluna **`Backlog`** ou ser visualizada como Épico agrupador (Roadmap/Table view), permanecendo aberta até que todas as 6 Sub-Issues atinjam `Done`.
   - **Sub-Issues `SUB-01` a `SUB-06`:** Todas devem iniciar na coluna **`Backlog`**.
   - **Promoção Condicionada a `Ready`:** Assim que o revisor humano assinar a aprovação formal (comentário conclusivo), os cartões de `SUB-01` e `SUB-02` devem ser transicionados para **`Ready`**. As demais (`SUB-03` a `SUB-06`) também podem passar para `Ready` de especificação assim que revisadas, aguardando momento de puxada (`In Progress`) conforme suas dependências forem sendo liberadas.

3. **Regra Anti-Redundância de Labels:**
   - **É estritamente proibido criar labels como `status:ready`, `status:backlog` ou `in-progress`.**
   - O controle de estado operacional é gerenciado com exclusividade pelo campo nativo **`Status`** do GitHub Project, evitando duplicidade, dessincronização e poluição visual nas issues.

---

### Etapa 7: Auditoria e Validação Final do Board
O Coordenador (`@brunosouza-tech`) deve executar a checagem final:
- [ ] Todas as 6 Sub-Issues pertencem ao Projeto (Board);
- [ ] O campo `Status` de cada cartão reflete a realidade da DoR;
- [ ] Não há cartões órfãos (sem Assignee);
- [ ] Não há labels de status cadastradas nas issues;
- [ ] Os comentários de revisão cruzada estão devidamente publicados e com menções ativas aos membros.

