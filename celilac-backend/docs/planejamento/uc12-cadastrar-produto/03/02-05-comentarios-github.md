# Artefato 05 — Comentários Técnicos para o GitHub (Revisão Cruzada)

## 1. Instruções para a Equipe

Este artefato contém os comentários técnicos padronizados, prontos para serem copiados e publicados na aba de comentários de cada Sub-Issue no GitHub.

**Fluxo Operacional Recomendado:**
1. O **Revisor Designado** copia o comentário técnico correspondente à Sub-Issue e o publica no GitHub.
2. O **Responsável pela Sub-Issue (Assignee)** lê as observações e aplica os ajustes necessários no corpo (descrição) da Issue.
3. O Revisor retorna à Issue, verifica as alterações e publica o comentário de conclusão utilizando o **Template de Conclusão de Revisão** (Seção 3).

---

## 2. Comentários Técnicos Prontos para Publicação por Sub-Issue

### 2.1 Comentário para a Sub-Issue [SUB-01]

```markdown
### 🔍 Análise Prévia de Revisão de Planejamento

- **Sub-Issue:** `[SUB-01]` Modelar a Entidade de Domínio Product e Invariantes
- **Responsável Designado:** @anasilva-dev
- **Revisor Designado:** @brunosouza-tech
- **Data da Avaliação:** 10/11/2026

#### 1. Elementos Avaliados
- [x] Clareza e objetividade do título e escopo;
- [x] Alinhamento com as Regras de Negócio RN01, RN02 e RN03;
- [!] Detalhamento da estratégia de instanciação e integridade de tipos;
- [!] Verificabilidade dos critérios de aceite.

#### 2. Apontamentos e Oportunidades de Ajuste
- **Geração de ID:** A descrição atual cita `id: string/UUID`, mas não explicita se o ID é autogerado pela entidade na instanciação ou injetado. Recomenda-se adotar um método estático de fábrica (`Product.create(...)`) que gere o UUID nativamente para novos produtos.
- **Validação de Tamanho do Nome:** O critério atual menciona rejeitar strings vazias ou em branco, mas não define comprimento mínimo ou sanitização (`trim`).

#### 3. Ajustes Recomendados no Corpo da Issue
1. Incluir na seção técnica a menção ao padrão Factory Method (`Product.create({ name, price })`).
2. Ajustar o Critério de Aceite 2 para: *"A instanciação com nome nulo, vazio, contendo apenas espaços ou com menos de 2 caracteres válidos deve lançar exceção de domínio"*.

#### 4. Condições para Prontidão (Ready)
- Atualização da descrição com os ajustes solicitados;
- Confirmação formal da revisão por @brunosouza-tech.
```

---

### 2.2 Comentário para a Sub-Issue [SUB-02]

```markdown
### 🔍 Análise Prévia de Revisão de Planejamento

- **Sub-Issue:** `[SUB-02]` Implementar DTOs de Entrada e Saída com Validações de Contrato
- **Responsável Designado:** @carlamendes-qa
- **Revisora Designada:** @anasilva-dev
- **Data da Avaliação:** 10/11/2026

#### 1. Elementos Avaliados
- [x] Definição dos contratos de transferência de dados;
- [x] Decorators de validação com `class-validator`;
- [!] Sanitização de entrada e limites de tamanho;
- [x] Separação entre payload público e interno.

#### 2. Apontamentos e Oportunidades de Ajuste
- **Sanitização de Strings:** Caso o cliente envie um nome com espaços acidentais no início ou no fim (ex.: `" Arroz  "`), deve ser aplicado um transformador para normalização antes da validação.
- **Limite Superior:** Falta estipular tamanho máximo razoável para o campo `name` para proteger a persistência contra estouro de campo (ex.: `@MaxLength(150)`).

#### 3. Ajustes Recomendados no Corpo da Issue
1. Adicionar na descrição técnica o uso de `@Transform(({ value }) => typeof value === 'string' ? value.trim() : value)` no campo `name`.
2. Adicionar decorator `@MaxLength(150)` no `CreateProductDto`.
3. Adicionar aos Critérios de Aceite a verificação de mensagens de erro claras e amigáveis retornadas pelo `ValidationPipe`.

#### 4. Condições para Prontidão (Ready)
- Inclusão dos refinamentos de validação e sanitização no texto do DTO;
- Parecer final registrado por @anasilva-dev.
```

---

### 2.3 Comentário para a Sub-Issue [SUB-03]

```markdown
### 🔍 Análise Prévia de Revisão de Planejamento

- **Sub-Issue:** `[SUB-03]` Configurar Persistência, Schema de Banco e Repositório de Produtos
- **Responsável Designado:** @brunosouza-tech
- **Revisora Designada:** @carlamendes-qa
- **Data da Avaliação:** 10/11/2026

#### 1. Elementos Avaliados
- [x] Estrutura da migration PostgreSQL via TypeORM;
- [x] Contrato da interface do repositório (`ProductRepository`);
- [!] Precisão do tipo numérico e mapeamento de tipos no ORM;
- [!] Isolamento e testabilidade da camada de infraestrutura.

#### 2. Apontamentos e Oportunidades de Ajuste
- **Tipo Numérico do Preço:** O PostgreSQL armazena valores decimais monetários como `numeric`/`decimal`. No TypeORM, colunas desse tipo são devolvidas como `string` em runtime no JavaScript para evitar erros de ponto flutuante. É essencial documentar como o repositório entregará esse valor para o domínio (ex.: via `ColumnTransformer` ou conversão explícita para `number`).
- **Idempotência de Migrations:** Garantir que a migration execute sem conflito em ambientes zerados de CI.

#### 3. Ajustes Recomendados no Corpo da Issue
1. Detalhar na descrição técnica a especificação da coluna: `type: 'decimal', precision: 10, scale: 2` com transformer numérico.
2. Adicionar nos critérios de aceite a garantia de que a interface do repositório utilize exclusivamente a entidade de domínio `Product`, desacoplando as camadas superiores dos detalhes do TypeORM.

#### 4. Condições para Prontidão (Ready)
- Conclusão da Sub-Issue predecessora `SUB-01`;
- Refinamento do tratamento de tipos decimais;
- Homologação do parecer por @carlamendes-qa.
```

---

### 2.4 Comentário para a Sub-Issue [SUB-04]

```markdown
### 🔍 Análise Prévia de Revisão de Planejamento

- **Sub-Issue:** `[SUB-04]` Implementar o Serviço de Aplicação para Cadastro de Produto
- **Responsável Designado:** @anasilva-dev
- **Revisor Designado:** @brunosouza-tech
- **Data da Avaliação:** 10/11/2026

#### 1. Elementos Avaliados
- [x] Orquestração do caso de uso e cumprimento de RN01 a RN04;
- [x] Conversão entre DTOs e entidades;
- [!] Padronização do tratamento e hierarquia de exceções;
- [x] Testabilidade unitária com dublês (mocks).

#### 2. Apontamentos e Oportunidades de Ajuste
- **Tratamento de Exceções:** A Sub-Issue menciona lançar exceções tratáveis, mas não especifica se serão exceções nativas do NestJS (`BadRequestException`, `ConflictException`) ou exceções de domínio customizadas tratadas por um `ExceptionFilter`. Para manter a arquitetura limpa, recomenda-se criar exceções de domínio que sejam mapeadas para status HTTP na borda.
- **Rastreabilidade de Atomicidade:** Reforçar a regra de que o repositório jamais deve ser acionado caso ocorra falha prévia de validação das regras de negócio.

#### 3. Ajustes Recomendados no Corpo da Issue
1. Definir explicitamente as classes de exceção esperadas (ex.: `InvalidProductException`).
2. Adicionar critério de aceite atestando que nenhuma chamada a `repository.create()` é disparada quando os dados de entrada violam as invariantes.

#### 4. Condições para Prontidão (Ready)
- Conclusão e estabilização de `SUB-01`, `SUB-02` e `SUB-03`;
- Especificação da taxonomia de exceções;
- Registro da revisão formal por @brunosouza-tech.
```

---

### 2.5 Comentário para a Sub-Issue [SUB-05]

```markdown
### 🔍 Análise Prévia de Revisão de Planejamento

- **Sub-Issue:** `[SUB-05]` Implementar o Controlador HTTP e Rota POST /products
- **Responsável Designado:** @brunosouza-tech
- **Revisora Designada:** @carlamendes-qa
- **Data da Avaliação:** 10/11/2026

#### 1. Elementos Avaliados
- [x] Configuração da rota `POST /products` no NestJS;
- [x] Aplicação do `ValidationPipe` global/local;
- [!] Política de segurança e autorização da rota (Auth Guards);
- [x] Documentação OpenAPI/Swagger.

#### 2. Apontamentos e Oportunidades de Ajuste
- **Segurança e Autenticação:** A análise técnica do UC12 menciona ator com permissão prévia, porém o módulo global de autenticação pode não estar implementado nesta sprint. Recomenda-se registrar explicitamente que a rota será criada aberta no momento inicial, deixando um comentário/TODO padronizado para `@UseGuards(JwtAuthGuard)`.
- **Códigos de Resposta:** Confirmar que a rota retorna exatamente `201 Created` no sucesso e que o Swagger espelhe os esquemas de erro 400 e 500.

#### 3. Ajustes Recomendados no Corpo da Issue
1. Deixar documentada a estratégia de liberação temporária de autorização para testes locais.
2. Garantir que a anotação `@HttpCode(HttpStatus.CREATED)` ou `@Post()` padrão do NestJS esteja documentada no arquivo do controller.

#### 4. Condições para Prontidão (Ready)
- Conclusão das dependências `SUB-02` e `SUB-04`;
- Esclarecimento quanto ao escopo de autenticação;
- Validação formal por @carlamendes-qa.
```

---

### 2.6 Comentário para a Sub-Issue [SUB-06]

```markdown
### 🔍 Análise Prévia de Revisão de Planejamento

- **Sub-Issue:** `[SUB-06]` Implementar Suíte Completa de Testes Automatizados (Unitários e E2E)
- **Responsável Designado:** @carlamendes-qa
- **Revisora Designada:** @anasilva-dev
- **Data da Avaliação:** 10/11/2026

#### 1. Elementos Avaliados
- [x] Cobertura de testes unitários de domínio e aplicação;
- [x] Cobertura de testes de integração / E2E com Supertest e Vitest;
- [!] Estratégia de isolamento e limpeza do banco de dados relacional;
- [x] Asserção de não-persistência em cenários de falha.

#### 2. Apontamentos e Oportunidades de Ajuste
- **Isolamento de Base de Testes:** Nos testes E2E, a execução consecutiva de testes de inserção sem limpeza de banco pode gerar efeitos colaterais ou falsos positivos. Recomenda-se incluir na descrição técnica a rotina de limpeza (`TRUNCATE products`) antes de cada bateria E2E.
- **Simulação de Falha de Infraestrutura (500):** Detalhar como o cenário de indisponibilidade de banco será reproduzido (ex.: mockando a rejeição da Promise do repositório no módulo de teste).

#### 3. Ajustes Recomendados no Corpo da Issue
1. Inserir orientação de setup e teardown de banco de dados para os testes E2E.
2. Definir o padrão de mock para simulação de erro 500 no teste de integração.

#### 4. Condições para Prontidão (Ready)
- Conclusão e integração das Sub-Issues funcionais (`SUB-01` a `SUB-05`);
- Detalhamento do teardown de dados;
- Aprovação técnica documentada por @anasilva-dev.
```

---

## 3. Template Padrão de Conclusão de Revisão pelo Revisor Humano

Para ser preenchido e publicado no GitHub pelo integrante responsável pela revisão assim que os ajustes forem finalizados:

```markdown
### 📋 Registro de Revisão de Planejamento

**Revisor:** @[usuario_github]
**Issue:** [SUB-XX] - [Título da Sub-Issue]
**Data da Revisão:** [DD/MM/AAAA]
**Resultado:** [ ] Aprovada sem ressalvas | [ ] Aprovada com ajustes menores | [ ] Ajustes necessários solicitados

**Observações Técnicas:**
- [Registro dos pontos verificados na especificação e critérios de aceite]

**Ajustes Solicitados:**
- [Ajustes que o responsável pela Issue precisa aplicar no texto/critérios, se houver]

**Conclusão e Prontidão:**
- [Indicação se a Issue está liberada para o estado 'Ready' ou deve aguardar ajustes em 'Backlog']
```

