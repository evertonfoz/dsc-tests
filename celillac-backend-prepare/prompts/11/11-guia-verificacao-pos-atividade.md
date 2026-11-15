# Guia de Verificação Pós-Atividade — Material 11

**Estabilização e Testes dos Contratos HTTP da API (CeliLac, UC12 — Cadastrar Produto)**

Use este guia **depois** de executar a atividade do Material 11, para conferir com evidências reais se o contrato público HTTP, o mapeamento de saída, os testes de não exposição e o ambiente containerizado funcionam corretamente. Todos os comandos são não destrutivos. Execute-os na pasta `celillac-backend-prepare/`, na branch `feature/uc12-10-http-contract-stabilization`.

> Registre a saída real de cada passo. Não marque um item como concluído apenas porque o comando "rodou": confira o **resultado esperado**.

---

## 0. Pré-requisitos

| Verificação | Comando | Esperado |
|---|---|---|
| Branch | `git branch --show-current` | `feature/uc12-10-http-contract-stabilization` |
| Contratos internos preservados | `git diff feature/uc12-09-backend-containerization -- src/modules/products/entities/ src/modules/products/services/ src/modules/products/repositories/ src/infrastructure/` | saída vazia (nenhuma alteração em domínio, service, repository ou ORM) |
| `.env` existe e não é versionado | `git check-ignore .env` | imprime `.env` |
| Docker disponível | `docker --version` | versão exibida |

---

## 1. Compilação e Lint

```bash
pnpm build
pnpm lint
```

**Esperado:**
- `pnpm build` (`nest build`) conclui com código `0` e sem erros de tipagem (`import type` coerente com `isolatedModules` e `nodenext`).
- `pnpm lint` conclui com `0 errors` (apenas eventuais avisos pré-existentes fora dos arquivos alterados).

---

## 2. Presença e Separação do Mapper HTTP

Verifique os arquivos do módulo de produtos:

- `src/modules/products/mappers/product-response.mapper.ts` exporta `ProductResponseDto` (`productId: string`, `name: string`) e `toProductResponse(product: Product): ProductResponseDto`.
- `src/modules/products/controllers/products.controller.ts` retorna `Promise<ProductResponseDto>` via `toProductResponse(product)`, preservando `this.productsService.createProduct(dto.name)`.
- `src/infrastructure/persistence/products/product.mapper.ts` (`ProductMapper`) permanece intocado.

---

## 3. Testes Automatizados de Contrato e Regressão

```bash
pnpm test                          # suíte rápida (inclui products.controller.spec.ts)
docker compose up -d postgres_test # garante o banco isolado de testes
pnpm test:integration              # TypeOrmProductsRepository contra celilac_test (porta 5435)
```

**Esperado:**
- `pnpm test` aprova todos os testes (referência do Material 11: **13 testes em 5 arquivos**, sendo **3 testes** em `products.controller.spec.ts`: `201`, `400` e não exposição de `internalNote` com asserção fechada `toEqual()`).
- `pnpm test:integration` aprova **1 teste em 1 arquivo** contra `celilac_test`.
- Registre os números **obtidos agora**; valores históricos não substituem a execução atual.

### Atenção sobre `pnpm test:e2e`
O script `test:e2e` executa `test/app.e2e-spec.ts` e `test/orders/confirm-order.e2e-spec.ts`, suítes legadas fora do UC12 que sobem o `AppModule` completo conectado ao banco do `.env` (`celilac_db`). Só execute se souber exatamente o impacto no banco de desenvolvimento; caso contrário, registre como fora do escopo do UC12.

---

## 4. Reconstrução e Verificação da API Containerizada

Como `ProductsController` e o mapper HTTP foram alterados/criados, **não** valide o contrato na imagem antiga:

```bash
docker compose up -d --build api
docker compose ps
docker compose logs api | tail -20
```

**Esperado:**
- Imagem `celilac-api:dev` reconstruída sem erros.
- `celilac-postgres` com status `healthy` e `celilac-api` com status `Up`.
- Logs exibindo `{/products, POST}` mapeado e `Server is running on http://localhost:3200`.

---

## 5. Verificação do Contrato HTTP e Semântica de Erros

Execute os cenários abaixo contra `http://localhost:3200/products`:

### 5.1 Sucesso (`201 Created`)
```bash
curl -i -s -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto de exemplo"}'
```
**Esperado:** `HTTP/1.1 201 Created`, `Content-Type: application/json; charset=utf-8`, JSON contendo **exclusivamente** `productId` (UUID string) e `name` (`"Produto de exemplo"`). Anote o `productId`.

### 5.2 Propriedade extra na entrada (`whitelist: true`)
```bash
curl -i -s -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto whitelist","extraField":"ignored"}'
```
**Esperado:** `HTTP/1.1 201 Created` com apenas `productId` e `name` (o campo `extraField` é descartado pelo `ValidationPipe`).

### 5.3 Entradas inválidas (`400 Bad Request`)
```bash
curl -i -s -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name":""}'

curl -i -s -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{}'

curl -i -s -X POST http://localhost:3200/products \
  -H "Content-Type: application/json" \
  -d '{"name":123}'
```
**Esperado:** todos retornam `HTTP/1.1 400 Bad Request` com `statusCode: 400`, `error: "Bad Request"` e lista de mensagens de validação em `message`.

---

## 6. Confirmação no PostgreSQL (Somente Leitura)

Substitua `<PRODUCT_ID>` pelo UUID retornado no passo 5.1:

```bash
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
SELECT * FROM products.products WHERE "productId" = '<PRODUCT_ID>';
SQL
```

**Esperado:** `1 row` com o mesmo `productId` e `name` retornados pela API.

---

## 7. Checklist de Evidências para o Pull Request

Cole no PR a saída real (sem senhas):

- [ ] `pnpm build` e `pnpm lint` sem erros
- [ ] `pnpm test` (`5 passed files`, `13 passed tests`) e `pnpm test:integration` (`1 passed file`, `1 passed test`)
- [ ] `docker compose up -d --build api` e `docker compose ps` com `celilac-api` `Up` e `celilac-postgres` `healthy`
- [ ] `POST /products` (`201 Created`) com apenas `productId` e `name`
- [ ] `POST /products` com propriedade extra (`whitelist: true` preservado)
- [ ] `POST /products` com entrada inválida (`400 Bad Request`)
- [ ] Consulta SQL em `products.products` confirmando o `productId` criado
- [ ] `git status` limpo, sem `.env`, sem alterações indevidas em `Product`, `ProductsService`, `ProductsRepository` ou `ProductMapper`

---

## 8. Problemas Conhecidos e Armadilhas

1. **Testar na imagem Docker antiga:** rodar `curl` sem `docker compose up -d --build api` valida o código do Material 10, não o `ProductsController` refatorado.
2. **Usar `toMatchObject()` no teste de contrato fechado:** `toMatchObject()` passa mesmo quando campos extras (como `internalNote`) vazam na resposta. Use `toEqual()` para garantir contrato fechado.
3. **Confundir tipo TypeScript com runtime:** `interface ProductResponseDto` desaparece na compilação; quem garante o filtro em execução é `toProductResponse()`.
4. **Confundir `toProductResponse()` com `ProductMapper`:** `toProductResponse` pertence à fronteira HTTP (`Product -> ProductResponseDto`); `ProductMapper` pertence à infraestrutura (`Product <-> ProductOrmEntity`).
5. **`pnpm` no host alterando `pnpm-lock.yaml`:** após rodar testes locais, confira `git status` para garantir que o lockfile não foi modificado indevidamente.

---

## 9. Distinções que o Aluno Deve Conseguir Explicar

- **Tipo em compilação ≠ serialização em runtime.** Interfaces TypeScript não removem propriedades extras em tempo de execução.
- **DTO de entrada (`CreateProductDto`) ≠ Entidade de domínio (`Product`) ≠ Entidade ORM (`ProductOrmEntity`) ≠ DTO de resposta (`ProductResponseDto`).**
- **Teste com Service simulado ≠ Teste integrado ≠ API containerizada ≠ Consulta SQL.** Cada camada comprova uma garantia distinta (fronteira HTTP, persistência em `celilac_test`, execução real no contêiner e dados em `celilac_db`).
- **Mudança compatível ≠ Breaking change.** Renomear campo, trocar tipo, mudar status HTTP ou encapsular em `data` quebra consumidores; até mesmo adicionar campo opcional depende de o cliente usar validação aberta ou fechada.

