# ARTEFATO 12-06 — VERIFICAÇÃO DE REGRESSÕES E SEGURANÇA DE AMBIENTES

## 1. Linha de Base Histórica vs. Execução Atual

Conforme exigido pelo Material 12, os resultados obtidos no Material 11 foram tratados como referência histórica. Todas as suítes pertinentes foram reexecutadas no ambiente local durante a auditoria para produzir evidências atualizadas:

| Suíte / Verificação | Comando Executado | Resultado Material 11 (Histórico) | Resultado Material 12 (Execução Atual) | Situação |
|---|---|---|---|---|
| **Testes Rápidos de Produtos (UC12)** | `pnpm vitest run src/modules/products/` | 6 testes aprovados (3 arquivos) | **6 testes aprovados (3 arquivos)** | **100% Aprovado** |
| **Persistência Real PostgreSQL** | `pnpm test:integration` | 1 teste aprovado (1 arquivo) | **1 teste aprovado (1 arquivo)** | **100% Aprovado** |
| **Compilação do Projeto** | `pnpm build` | Código 0 (Sucesso) | **Código 0 (Sucesso)** | **100% Aprovado** |
| **Análise Estática (Linter)** | `pnpm lint` | 0 erros | **0 erros** (12 warnings mapeados fora de produtos) | **100% Aprovado** |
| **API Containerizada HTTP** | `curl -X POST http://localhost:3200/products` | 201 Created | **201 Created (JSON verificado)** | **100% Aprovado** |
| **Persistência SQL no Contêiner** | `docker exec celilac-postgres psql ...` | Registro persistido | **Registro persistido confirmado** | **100% Aprovado** |

---

## 2. Detalhamento da Execução dos Testes Rápidos do UC12

Comando executado:
```bash
$ pnpm vitest run src/modules/products/
```

Saída real obtida:
```text
 RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend

 ✓ src/modules/products/services/products.service.spec.ts (1 test) 70ms
 ✓ src/modules/products/controllers/products.controller.spec.ts (3 tests) 76ms
 ✓ src/modules/products/products.integration.spec.ts (2 tests) 55ms

 Test Files  3 passed (3)
      Tests  6 passed (6)
   Start at  10:38:30
   Duration  554ms
```

### Escopo Coberto pelos Testes:
1. `products.service.spec.ts`: Criação e salvamento de produto com dados válidos atendendo ao critério `CA01`.
2. `products.controller.spec.ts`:
   - Resposta `201 Created` e retorno de `ProductResponseDto` para entradas válidas.
   - Rejeição na fronteira HTTP com `400 Bad Request` para payloads sem nome ou inválidos.
   - Rejeição de vazamento de dados: simulação de propriedade interna (`internalNote`) no mock e asserção fechada com `toEqual` validando sua não exposição.
3. `products.integration.spec.ts`:
   - Integração do módulo NestJS com substituição de provider para `InMemoryProductsRepository`.
   - Teste de fluxo completo com `ValidationPipe` ativo.

---

## 3. Segurança dos Ambientes PostgreSQL e Suíte de Integração

### 3.1. Isolamento Rigoroso entre Ambientes
O projeto mantém dois serviços PostgreSQL distintos no `compose.yaml`:
1. **Banco de Desenvolvimento (`celilac-postgres`):**
   - Porta no Host: `5432`
   - Banco de Dados: `celilac_db`
   - Usuário: `celilac_user`
   - Uso: Execução da API local e testes manuais de ponta a ponta.
2. **Banco de Testes Isolado (`celilac-postgres-test`):**
   - Porta no Host: `5435` (mapeada para `5432` internamente no contêiner)
   - Banco de Dados: `celilac_test`
   - Usuário: `celilac_test`
   - Uso: Exclusivo para a suíte automatizada `test:integration`.

### 3.2. Salvaguardas no Código de Teste
O arquivo `typeorm-products.repository.postgres.spec.ts` implementa salvaguardas programáticas obrigatórias antes de executar qualquer migration ou `TRUNCATE`:
* Consulta `current_database()`, `current_user` e a porta configurada no cliente.
* Valida explicitamente se o banco é `celilac_test` e se a variável `TEST_DB_ALLOW_DESTRUCTIVE === 'true'`.
* Caso qualquer checagem falhe, a suíte aborta imediatamente sem tocar nos dados.

### 3.3. Execução da Suíte de Persistência Real
```bash
$ pnpm test:integration
```

Saída real obtida:
```text
 RUN  v4.1.11 /Users/evertoncoimbradearaujo/Documents/GitHub/dsc-tests/celilac-backend

 ✓ src/infrastructure/persistence/products/typeorm-products.repository.postgres.spec.ts (1 test) 82ms
   ✓ TypeOrmProductsRepository — persistência real no PostgreSQL (1)
     ✓ deve persistir um produto no PostgreSQL e confirmar o registro diretamente no banco 32ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:38:45
   Duration  453ms
```

---

## 4. Análise de Risco e Política sobre `pnpm test:e2e`

### 4.1. Inspeção Prévia Obrigatória
Conforme orientado pelo Material 12 (Seção 11 e Guia 5.3), a configuração e os arquivos de E2E foram inspecionados antes de qualquer invocação:
* `vitest.config.e2e.ts` procura arquivos `**/*.e2e-spec.ts`.
* Os arquivos encontrados foram `test/app.e2e-spec.ts` e `test/orders/confirm-order.e2e-spec.ts`.
* **Não existe suíte E2E do caso de uso `UC12` (produtos) em `test/`.**
* O teste E2E existente instancia o `AppModule` completo conectado ao banco de desenvolvimento (`.env`, porta `5432`, `celilac_db`).

### 4.2. Decisão Técnica: Não Execução de `pnpm test:e2e`
* **Classificação:** Não executado — risco ao banco de desenvolvimento e escopo não relacionado ao UC12.
* **Justificativa:** O script `test:e2e` não possui isolamento garantido para o banco `celilac_test` e opera exclusivamente sobre o caso de uso legado de `orders`, que se encontra fora do escopo do `UC12`. Executá-lo violaria o princípio de segurança de dados e proteção ao banco de desenvolvimento.

---

## 5. Compilação e Análise Estática

### 5.1. Build TypeScript (`pnpm build`)
* Executado `nest build`.
* Transpilação concluída com sucesso sem erros de tipagem (`Exit code: 0`).

### 5.2. Linter (`pnpm lint`)
* Executado `oxlint --type-aware src/ test/`.
* **Erros:** 0 erros.
* **Avisos:** 12 avisos pré-existentes identificados no módulo de `orders` (`src/modules/orders/`) e em scripts auxiliares (`verify-persistence.ts`), sem relação com o caso de uso `UC12`. O módulo de produtos permaneceu com zero erros e zero advertências estruturais.

---

## 6. Verificação do Endpoint HTTP Real na API Containerizada

Com o contêiner `celilac-api` ativo na porta `3200`, foram executadas requisições `curl` para validação de ponta a ponta:

1. **Criação de Produto Válido:**
   ```bash
   curl -i -X POST http://localhost:3200/products \
     -H "Content-Type: application/json" \
     -d '{"name": "Auditoria Arquitetural M12"}'
   ```
   **Resposta:** `HTTP/1.1 201 Created`
   ```json
   {"productId":"f025eb55-a845-40e2-889a-1f6d108795ce","name":"Auditoria Arquitetural M12"}
   ```

2. **Consulta Direta no PostgreSQL:**
   ```bash
   docker exec celilac-postgres psql -U celilac_user -d celilac_db \
     -c "SELECT * FROM products.products WHERE name = 'Auditoria Arquitetural M12';"
   ```
   **Resultado:** 1 linha confirmada (`productId: f025eb55-a845-40e2-889a-1f6d108795ce`).

3. **Rejeição de Payload Inválido:**
   ```bash
   curl -s -X POST http://localhost:3200/products \
     -H "Content-Type: application/json" \
     -d '{"name": ""}'
   ```
   **Resultado:** `400 Bad Request` com `{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}`.

4. **Sanitização de Campos Extras (`whitelist: true`):**
   ```bash
   curl -s -X POST http://localhost:3200/products \
     -H "Content-Type: application/json" \
     -d '{"name": "Teste Extra Field", "extraField": "descartar"}'
   ```
   **Resultado:** `201 Created` contendo apenas `productId` e `name`. O campo `extraField` foi sumariamente descartado na fronteira HTTP.

---

## 7. Reconhecimento de Limitações das Verificações

A aprovação integral de todos os testes unitários, integrados, de persistência e contratuais comprova que o comportamento especificado nos requisitos foi atendido sem regressões. Todavia, em consonância com a disciplina de Engenharia de Software, **a aprovação em testes reduz riscos, mas não constitui prova matemática de ausência absoluta de defeitos**. Cenários concorrentes em alta escala ou indisponibilidade catastrófica de rede demandam validações adicionais de engenharia de confiabilidade (*resilience engineering*).
