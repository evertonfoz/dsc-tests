# Guia de Verificação Pós-Atividade — Material 11

**Estabilização e Testes dos Contratos HTTP da API (no projeto da sua equipe)**

Use este guia **depois** de executar o prompt do Material 11, para conferir por conta própria, com evidências reais, se o contrato público HTTP, o mapeamento de saída, os testes de não exposição e o ambiente containerizado funcionam corretamente. Todos os comandos são **não destrutivos**. Execute-os na raiz do backend, na branch de trabalho desta atividade.

> Registre a saída real de cada passo. Não marque um item como concluído apenas porque o comando "rodou": confira o **resultado esperado**.

---

## 0. Antes de começar: preencha a tabela do seu projeto

Os exemplos usam placeholders `<...>`. Descubra os valores reais no seu código, `compose.yaml` e `package.json`.

| Placeholder | O que é | Valor no seu projeto | Exemplo (CeliLac) |
|---|---|---|---|
| `<BRANCH>` | branch de trabalho desta atividade | | `feature/uc12-10-http-contract-stabilization` |
| `<BRANCH_ANTERIOR>` | branch do Material 10 (base de comparação) | | `feature/uc12-09-backend-containerization` |
| `<API>` | serviço da API no Compose | | `api` |
| `<DB>` | serviço do PostgreSQL de desenvolvimento | | `postgres` |
| `<DB_TEST>` | serviço do PostgreSQL de testes | | `postgres_test` |
| `<PORTA_HTTP>` | porta HTTP da API | | `3200` |
| `<ROTA>` | rota do caso de uso | | `/products` |
| `<CAMPOS_PUBLICOS>` | campos do contrato público | | `productId`, `name` |
| `<CAMPO_INTERNO>` | propriedade interna usada só no mock do teste | | `internalNote` |
| `<SCHEMA.TABELA>` / `<COLUNA_ID>` | tabela e coluna do identificador | | `products.products` / `"productId"` |
| `<PASTAS_INTERNAS>` | pastas de domínio, service, repository e ORM | | `src/modules/products/entities/ …/services/ …/repositories/ src/infrastructure/` |

---

## 1. Pré-requisitos

| Verificação | Comando | Esperado |
|---|---|---|
| Branch | `git branch --show-current` | o valor de `<BRANCH>` |
| Contratos internos preservados | `git diff <BRANCH_ANTERIOR> -- <PASTAS_INTERNAS>` | saída **vazia** (nenhuma alteração em domínio, service, repository ou ORM) |
| `.env` existe e **não** é versionado | `git check-ignore .env` | imprime `.env` |
| Docker disponível | `docker --version` | versão exibida |

> Se o diff das pastas internas **não** estiver vazio, investigue: o Material 11 não deveria alterar domínio, Service, Repository ou ORM.

---

## 2. Compilação e lint

Use os scripts reais do seu `package.json`:

```bash
pnpm build
pnpm lint
```

**Esperado:**
- `pnpm build` conclui com código `0` e sem erros de tipagem (atenção a `import type` quando o projeto usa `isolatedModules`, `verbatimModuleSyntax` ou `nodenext`).
- `pnpm lint` conclui com `0 errors` (avisos pré-existentes fora dos arquivos alterados são aceitáveis).

---

## 3. Presença e separação do mapper HTTP

Verifique no código do seu módulo:

- Existe um **DTO de resposta** com exatamente os `<CAMPOS_PUBLICOS>` e tipos definidos no artefato 11-02.
- Existe um **mapper explícito** (função ou classe) que converte entidade de domínio → DTO de resposta.
- O **Controller** retorna o DTO de resposta (`Promise<...ResponseDto>`) via esse mapper e **continua delegando ao método original do Service** (sem trocar a assinatura).
- O **Mapper de persistência** (domínio ↔ ORM, do Material 09) permanece **intocado**: `git diff <BRANCH_ANTERIOR> -- <pasta do mapper de persistência>` vazio.
- Se o seu projeto já usa outro mecanismo (por exemplo, `ClassSerializerInterceptor`), confirme que a decisão está documentada no artefato 11-03.

---

## 4. Testes automatizados de contrato e regressão

```bash
pnpm test                          # suíte rápida (inclui o spec do Controller)
docker compose up -d <DB_TEST>     # garante o banco isolado de testes
pnpm test:integration              # adaptador do repositório contra o banco de TESTES
```

**Esperado:**
- `pnpm test` aprova **todos** os testes, incluindo, no spec do Controller: o cenário de sucesso, o cenário inválido (`400`) e o teste de **não exposição** do `<CAMPO_INTERNO>`.
- O teste de não exposição usa asserção **fechada** (`toEqual`) e o mock do Service usa o **método real** que o Controller chama.
- `pnpm test:integration` aprova contra o **banco de testes**.
- Registre os números **obtidos agora**. Contagens de materiais anteriores são históricas e **não valem como evidência**. Compare com a sua linha de base (artefato 11-01): o total deve ter **crescido** pelos novos testes, sem falhas.

### Teste de sanidade (recomendado)
Para confirmar que o teste de não exposição realmente protege o contrato, altere **temporariamente** o Controller para devolver o objeto do Service sem passar pelo mapper e rode o spec: o teste **deve falhar**. Depois **desfaça** a alteração (`git checkout -- <arquivo do Controller>` ou `git diff` para conferir) e rode de novo: deve voltar a passar.

### Cuidado com suítes E2E legadas
Antes de rodar `pnpm test:e2e`, abra o script e os arquivos. Suítes geradas pelo scaffold do Nest ou de outros módulos sobem o `AppModule` completo e conectam ao banco do `.env` (o de **desenvolvimento**). Nesse caso **não as execute** e registre como *"não executado — fora do escopo e risco ao banco de desenvolvimento"*.

---

## 5. Reconstrução e verificação da API containerizada

Como o Controller e o mapper foram alterados/criados, **não** valide o contrato na imagem antiga:

```bash
docker compose up -d --build <API>
docker compose ps
docker compose logs <API> | tail -20
```

**Esperado:**
- imagem reconstruída sem erros;
- PostgreSQL com status `healthy` e API com status `Up`;
- nos logs, a rota do caso de uso mapeada e a mensagem de servidor ouvindo em `<PORTA_HTTP>`.

---

## 6. Verificação do contrato HTTP e da semântica de erros

Execute os cenários contra `http://localhost:<PORTA_HTTP><ROTA>`. Adapte o payload ao seu domínio.

### 6.1 Sucesso
```bash
curl -i -s -X POST http://localhost:<PORTA_HTTP><ROTA> \
  -H "Content-Type: application/json" \
  -d '<payload válido>'
```
**Esperado:** o status de sucesso do seu contrato (no CeliLac, `201 Created`), `Content-Type: application/json; charset=utf-8` e JSON contendo **exclusivamente** os `<CAMPOS_PUBLICOS>`, com os tipos definidos. Anote o identificador.

### 6.2 Propriedade extra na entrada
```bash
curl -i -s -X POST http://localhost:<PORTA_HTTP><ROTA> \
  -H "Content-Type: application/json" \
  -d '<payload válido + "extraField":"ignored">'
```
**Esperado (com `whitelist: true`):** sucesso, com apenas os `<CAMPOS_PUBLICOS>` (o campo extra é descartado). Se a sua equipe optou por `forbidNonWhitelisted: true`, o esperado é `400` — confira com o artefato 11-04.

### 6.3 Entradas inválidas
Teste, no mínimo: campo obrigatório vazio, corpo `{}` e campo com tipo errado.
```bash
curl -i -s -X POST http://localhost:<PORTA_HTTP><ROTA> \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Esperado:** `400 Bad Request` com `statusCode: 400`, `error: "Bad Request"` e a lista de mensagens de validação em `message`. Verifique também que **nenhum detalhe interno** (stack trace, SQL, nomes de tabelas) aparece na resposta.

---

## 7. Confirmação no PostgreSQL (somente leitura)

Substitua `<ID>` pelo identificador retornado no passo 6.1:

```bash
docker compose exec -T <DB> sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM <SCHEMA.TABELA> WHERE <COLUNA_ID> = '<ID>';
SQL
```

**Esperado:** `1 row` com os mesmos valores devolvidos pela API. Observe que o banco pode ter **mais colunas** do que o contrato público: isso é esperado, e é justamente o que o DTO de resposta protege.

---

## 8. Checklist de evidências para o Pull Request

Cole no PR a saída real (**sem senhas**):

- [ ] `pnpm build` e `pnpm lint` sem erros
- [ ] `pnpm test` e `pnpm test:integration` com os números obtidos agora
- [ ] Teste de sanidade: falha sem o mapper, passa com o mapper (opcional)
- [ ] `docker compose up -d --build` e `docker compose ps` com API `Up` e PostgreSQL `healthy`
- [ ] Requisição de sucesso com apenas os campos públicos
- [ ] Requisição com propriedade extra
- [ ] Requisições inválidas com `400` e sem detalhes internos
- [ ] Consulta SQL confirmando o registro criado
- [ ] `git status` limpo, sem `.env`, e sem alterações indevidas em domínio, Service, Repository ou Mapper de persistência

---

## 9. Problemas comuns e armadilhas

1. **Testar na imagem Docker antiga:** rodar `curl` sem `docker compose up -d --build` valida o código do Material 10, não o Controller refatorado.
2. **Usar `toMatchObject()` no teste de contrato fechado:** passa mesmo quando campos extras vazam. Use `toEqual()`.
3. **Confundir tipo TypeScript com runtime:** a `interface` desaparece na compilação; quem filtra os campos em execução é o mapper.
4. **Confundir o mapper HTTP com o Mapper de persistência:** o mapper HTTP é `domínio → DTO de resposta` (fronteira HTTP); o de persistência é `domínio ↔ entidade ORM` (infraestrutura).
5. **Mock do método errado:** se o Controller chama `createX` e o mock define `create`, o teste quebra por motivo errado ou passa sem exercitar o Controller.
6. **Misturar Jest e Vitest:** use `vi.fn()` em projeto Vitest e `jest.fn()` em projeto Jest — nunca os dois.
7. **Duplicar `describe`/`beforeEach` ao incorporar o novo teste:** acrescente o cenário à suíte existente, sem recriar a inicialização do `INestApplication`.
8. **`pnpm` do host alterando o `pnpm-lock.yaml`:** após rodar testes locais, confira `git status`. Se o lockfile mudou sem você ter alterado dependências, investigue antes de commitar.
9. **UUID fixo em teste que cria registros reais:** o identificador é gerado a cada execução; use `expect.any(String)` ou valide o formato. Só fixe valores no teste com Service simulado.
10. **Comandos que nunca devem ser usados na verificação:** `docker compose down -v`, `migration:revert` automático, `synchronize: true` e qualquer operação destrutiva contra o banco de desenvolvimento.

---

## 10. Distinções que você deve conseguir explicar

- **Tipo em compilação ≠ serialização em runtime.** Interfaces TypeScript não removem propriedades extras em tempo de execução.
- **DTO de entrada ≠ entidade de domínio ≠ entidade ORM ≠ DTO de resposta.** Cada um tem uma responsabilidade distinta, mesmo compartilhando propriedades.
- **Teste com Service simulado ≠ teste integrado ≠ API containerizada ≠ consulta SQL.** Cada nível comprova uma garantia diferente (fronteira HTTP, interação real entre componentes, execução no contêiner e dados persistidos).
- **Mudança compatível ≠ breaking change.** Renomear campo, trocar tipo, mudar status HTTP ou encapsular em `data` quebra consumidores; até adicionar um campo opcional depende de o cliente validar de forma aberta ou fechada.
- **`whitelist` ≠ `forbidNonWhitelisted`.** O primeiro descarta propriedades extras; o segundo as rejeita com `400`.
