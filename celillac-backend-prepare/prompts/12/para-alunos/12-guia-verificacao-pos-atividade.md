# Guia de Verificação Pós-Atividade — Material 12

**Auditoria Arquitetural e Refatoração Orientada por Evidências (no projeto da sua equipe)**

Use este guia **depois** de executar o prompt do Material 12, para conferir por conta própria, com evidências reais, se a auditoria, a preservação dos contratos, a separação de camadas, os testes de regressão e o parecer técnico foram conduzidos corretamente. Todos os comandos são **não destrutivos**. Execute-os na raiz do backend, na branch de trabalho desta atividade.

> Registre a saída real de cada passo. Não marque um item como concluído apenas porque o comando "rodou": confira o **resultado esperado**.

---

## 0. Antes de começar: preencha a tabela do seu projeto

| Placeholder | O que é | Valor no seu projeto | Exemplo (CeliLac) |
|---|---|---|---|
| `<BRANCH>` | branch de trabalho | | `feature/uc12-10-http-contract-stabilization` |
| `<DIR_M11>` / `<DIR_M12>` | diretórios dos artefatos 11 e 12 | | `prompts/11/artefatos/` / `prompts/12/artefatos/` |
| `<ENTIDADE>` | arquivo da entidade de domínio | | `src/modules/products/entities/product.entity.ts` |
| `<REPO_IFACE>` | arquivo da interface/token do Repository | | `…/repositories/products.repository.interface.ts` |
| `<SERVICE>` | arquivo do Service | | `…/services/products.service.ts` |
| `<CONTROLLER>` | arquivo do Controller | | `…/controllers/products.controller.ts` |
| `<MODULO>` | módulo da funcionalidade | | `…/products/products.module.ts` |
| `<MAPPER_HTTP>` | mapper domínio → DTO de resposta | | `…/mappers/product-response.mapper.ts` |
| `<MAPPER_PERSIST>` | mapper domínio ↔ ORM | | `src/infrastructure/persistence/products/product.mapper.ts` |
| `<DB_TEST>` | serviço do banco de testes | | `postgres_test` |

---

## 1. Pré-requisitos e estado do repositório

| Verificação | Comando | Esperado |
|---|---|---|
| Branch atual | `git branch --show-current` | o valor de `<BRANCH>` |
| Ausência de alterações artificiais | `git diff -- src/ test/` | **saída vazia** se você concluiu pelo **Cenário B (preservação justificada)**; se concluiu pelo **Cenário A**, o diff deve conter **somente** o que o artefato `12-05` descreve |
| `.env` existe e **não** é versionado | `git check-ignore .env` | imprime `.env` |
| Artefatos do Material 11 | `ls <DIR_M11>/11-*.md` | 8 arquivos (`11-01` a `11-08`) |
| Artefatos do Material 12 | `ls <DIR_M12>/12-*.md` | 8 arquivos (`12-01` a `12-08`) |

---

## 2. Dependências arquiteturais (compilação × execução)

A auditoria deve comprovar que o **núcleo** (domínio e aplicação) não depende da infraestrutura nem da camada HTTP. Leia os arquivos (use o seu editor ou `cat`):

```bash
cat <ENTIDADE>
cat <REPO_IFACE>
cat <SERVICE>
cat <CONTROLLER>
```

Procure também, de forma objetiva, imports indevidos:

```bash
grep -n "typeorm" <ENTIDADE> <REPO_IFACE> <SERVICE> <CONTROLLER>
grep -n "infrastructure" <SERVICE> <CONTROLLER>
```

**Esperado:**
- A entidade de domínio **não importa** nada de ORM, HTTP ou Docker.
- A interface do Repository **não expõe tipos do ORM**.
- O Service importa apenas o contrato do Repository, a entidade e utilitários neutros; **não** importa `typeorm`, nem `infrastructure/`, nem DTOs HTTP.
- O Controller injeta apenas o Service e **não** importa `typeorm` nem `infrastructure/`.
- Os dois `grep` **não retornam linhas** para esses arquivos. Se retornarem, é um **achado** a ser analisado no artefato `12-03` (e não um "defeito" automático: avalie o contexto).

---

## 3. Providers e os dois mappers

```bash
cat <MODULO>
cat <MAPPER_HTTP>
cat <MAPPER_PERSIST>
```

**Esperado:**
- O módulo registra a entidade ORM em `TypeOrmModule.forFeature([...])` e vincula **o token do Repository ao adaptador concreto** (`{ provide: <TOKEN>, useClass: <AdaptadorOrm> }`).
- O **mapper HTTP** converte `domínio → DTO de resposta` (fronteira pública).
- O **mapper de persistência** converte `domínio ↔ entidade ORM` (fronteira de infraestrutura).
- Os dois mappers têm responsabilidades **distintas** e não se misturam.

---

## 4. Compilação e análise estática

Use os scripts reais do seu `package.json`:

```bash
pnpm build
pnpm lint
```

**Esperado:** `build` com código `0`; `lint` com `0 errors` (avisos pré-existentes fora do escopo auditado são aceitáveis, mas devem estar **listados** no artefato `12-06`).

---

## 5. Regressões e segurança do PostgreSQL

### 5.1 Suíte rápida
```bash
pnpm test
```
**Esperado:** todos os testes aprovados. Registre os números **obtidos agora** e compare com a linha de base do artefato `12-01`. Se o diff de código está vazio (Cenário B), os números devem ser **idênticos** aos da linha de base.

### 5.2 Suíte de persistência real (banco isolado)
```bash
docker compose up -d <DB_TEST>
pnpm test:integration
```
**Esperado:** aprovada, conectada **exclusivamente** ao banco de **testes** (confirme a identidade da conexão conforme o Material 09).

### 5.3 Atenção especial sobre `pnpm test:e2e`
Esse script **não é necessariamente** executado contra o banco de testes. Suítes legadas ou geradas pelo scaffold costumam subir o `AppModule` completo conectado ao banco do `.env` (**desenvolvimento**).

**Antes de executar:**
1. Abra o script no `package.json` e os arquivos de teste E2E.
2. Confirme qual banco será usado (`.env`).
3. Verifique se os testes **gravam, alteram ou removem** dados e se limpam **apenas** os registros que criaram.
4. Só execute se o impacto estiver compreendido e autorizado:
   ```bash
   pnpm test:e2e
   ```
5. Se **não** for possível confirmar a segurança, **não execute** e registre em `12-06`: *"não executado — risco ao banco de desenvolvimento"*, com a justificativa.

---

## 6. Checklist de evidências para o parecer técnico / Pull Request

Quando a auditoria conclui pelo **Cenário B (preservação justificada)**, **não** se cria commit artificial nem PR vazio: apresenta-se um **parecer técnico**. Confira se os artefatos `12-01` a `12-08` registram:

- [ ] Distinção explícita entre **fluxo de execução** e **dependências de compilação** (`12-02`)
- [ ] Avaliação dos componentes e dos **8 critérios** de qualidade, com evidências (`12-03`)
- [ ] **Hipóteses teóricas descartadas** com evidência, diferenciando **Observação** de **Problema** (`12-03` e `12-04`)
- [ ] Confirmação de que o mapper HTTP **já existia** (Material 11) e foi preservado, sem recriação (`12-05`)
- [ ] Resultados **reais** reexecutados de `test`, `test:integration`, `build` e `lint`, mais a análise de segurança de banco de testes × desenvolvimento (`12-06`)
- [ ] Decisões arquiteturais proporcionais ao escopo (`12-07`)
- [ ] Rastreabilidade com as **Issues reais** do seu GitHub, sem reutilizar a Issue de outra etapa e **sem declarar aprovação humana prematura** (`12-08`)

Se concluiu pelo **Cenário A (refatoração)**, confira também: problema e evidência registrados **antes** da mudança; alteração **mínima**; contratos preservados; testes reexecutados; diff inspecionado; PR documentado.

---

## 7. Problemas comuns e armadilhas

1. **Inventar refatoração apenas para gerar diff/commit:** renomear métodos, acrescentar campos não solicitados ou fazer edições cosméticas quebra contratos e contraria o princípio central da unidade.
2. **Tratar exemplos hipotéticos do material como defeitos reais:** Controller acessando o ORM ou mapeamento duplicado são **exemplos didáticos**; só são problemas se **existirem** no seu código.
3. **Confundir direção de chamada em runtime com dependência de código:** em runtime o Service chama o adaptador do ORM; em compilação é o **adaptador** que depende do **contrato** (Inversão de Dependência).
4. **Presumir que `implements Interface` resolve DI no NestJS:** interfaces somem no JavaScript; quem resolve a injeção é o provider `{ provide: TOKEN, useClass: Adaptador }` no módulo.
5. **Presumir que `pnpm test:e2e` usa o banco de testes:** confirme sempre o banco de destino antes.
6. **Declarar "arquitetura perfeita":** testes aprovados reduzem riscos no escopo exercitado, mas têm limites que devem ser reconhecidos no relatório.
7. **Marcar "revisão humana realizada" sem revisão:** registre como **pendente** até ela acontecer.
8. **Comandos que nunca devem ser usados:** `docker compose down -v`, `migration:revert` automático, `synchronize: true`, merge automático.

---

## 8. Distinções que você deve conseguir explicar

- **Fluxo de execução ≠ dependência arquitetural de compilação.**
- **Observação ≠ problema confirmado.** Nem toda característica observada exige refatoração.
- **Refatoração justificada (Cenário A) ≠ preservação justificada (Cenário B).** Preservar com base em evidências é uma decisão de engenharia completa e válida.
- **Mapper HTTP ≠ mapper de persistência.**
- **Testes aprovados ≠ garantia absoluta de ausência de defeitos.**
- **Funcionamento correto ≠ qualidade arquitetural.**
