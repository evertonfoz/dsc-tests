# ARTEFATO 10-06 — MIGRATIONS NO AMBIENTE CONTAINERIZADO E INICIALIZAÇÃO DO BACKEND

## 1. Verificação Prévia do Banco, DataSource Compilado e Migrations Compiladas

| Item Verificado | Valor / Caminho Real no Contêiner `api` | Status |
| :--- | :--- | :---: |
| **Serviço e Banco de Destino** | Serviço `postgres` (`celilac-postgres`, `172.24.0.2:5432`), banco `celilac_db`, usuário `celilac_user`. | Confirmado |
| **DataSource Compilado** | `/app/dist/database/data-source.js` | Confirmado |
| **Migrations Compiladas** | `/app/dist/database/migrations/*.js` (5 arquivos `.js`, incluindo `1794255600000-CreateProductsTable.js`) | Confirmado |
| **Compatibilidade ESM (`"type": "module"`)** | Todos os imports relativos em `dist/` utilizam extensão `.js` (`nodenext`) e o `DataSource` seleciona `dist/database/migrations/*.js` quando executado em `.js`. | Confirmado |
| **Scripts no `package.json`** | `"migration:show:prod": "typeorm migration:show -d dist/database/data-source.js"`<br>`"migration:run:prod": "typeorm migration:run -d dist/database/data-source.js"` | Confirmado |
| **`synchronize: false`** | Mantido estritamente como `false` em `AppModule` e `data-source.js`. | Confirmado |

---

## 2. Verificação do Histórico de Migrations no Contêiner (`migration:show`)

Seguindo a sequência obrigatória (**Banco disponível → Verificação do histórico → Aplicação das pendentes somente se necessário → Inicialização da API**), executou-se o comando de verificação em contêiner temporário antes de iniciar a API:

- **Comando executado:**
  ```bash
  docker compose run --rm api pnpm migration:show:prod
  ```
  *(Equivalente ao comando executado originalmente, `pnpm exec typeorm migration:show -d dist/database/data-source.js`; o script `migration:show:prod` encapsula o mesmo DataSource.)*
- **Saída real observada:**
  ```text
  [+] create 1/1
   ✔ Container celilac-postgres Running                                       0.0s
  [+] start 1/1
   ✔ Container celilac-postgres Running                                       0.0s
  Container celilac-postgres Waiting 
  Container celilac-postgres Healthy 
  Container celilac-backend-api-run-161c33686263 Creating 
  Container celilac-backend-api-run-161c33686263 Created 
  [X] 2 CreateOrdersAndPayments1791738728692
  [X] 3 AddDomainFieldsToOrdersAndPayments1791814820800
  [X] 4 UseDatabaseTimestamps1791814929531
  [X] 5 AddUpdatedAtTriggers1791815040413
  [X] 6 CreateProductsTable1794255600000
  ```

### Diagnóstico do Histórico de Migrations:
- Todas as 5 migrations do projeto — incluindo `[X] 6 CreateProductsTable1794255600000` aplicada no Material 09 sobre o volume `celilac-backend_celilac_postgres_data` — estão **marcadas como aplicadas (`[X]`)**.
- Não há nenhuma migration pendente (`[ ]`). Portanto, em conformidade com as regras do Material 10, **não foi executada nova rodada redundante nem comando destrutivo**, preservando intactos o esquema `products.products` e os dados existentes.

---

## 3. Inicialização da API Containerizada (Fase 8)

Após confirmar que todas as migrations estão aplicadas em `celilac_db`, iniciou-se o serviço `api` em background via Docker Compose:

### 3.1 Comando de Inicialização Executado
```bash
docker compose up -d --build api
```
- **Saída real observada:**
  ```text
  [+] up 3/3
   ✔ Image celilac-api:dev      Built                                         1.4s
   ✔ Container celilac-postgres Healthy                                       0.6s
   ✔ Container celilac-api      Started                                       0.7s
  ```

### 3.2 Estado dos Serviços (`docker compose ps`)
- **Comando executado:**
  ```bash
  docker compose ps
  ```
- **Saída real observada:**
  ```text
  NAME               IMAGE             COMMAND                  SERVICE    CREATED          STATUS                 PORTS
  celilac-api        celilac-api:dev   "docker-entrypoint.s…"   api        19 seconds ago   Up 17 seconds          0.0.0.0:3200->3200/tcp, [::]:3200->3200/tcp
  celilac-postgres   postgres:17       "docker-entrypoint.s…"   postgres   13 days ago      Up 13 days (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
  ```
  *(Nota: O contêiner `celilac-postgres-test` também permanece ativo e saudável na porta `0.0.0.0:5435->5432/tcp`, dedicado exclusivamente à suíte de testes PostgreSQL).*

### 3.3 Logs de Inicialização do Contêiner `celilac-api` (`docker compose logs api`)
- **Comando executado:**
  ```bash
  docker compose logs api
  ```
- **Saída real observada:**
  ```text
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [NestFactory] Starting Nest application...
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +4ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +1ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] AppModule dependencies initialized +12ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +13ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +1ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [InstanceLoader] OrdersModule dependencies initialized +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [RoutesResolver] AppController {/}: +7ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [RouterExplorer] Mapped {/, GET} route +1ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [RoutesResolver] OrdersController {/orders}: +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [RouterExplorer] Mapped {/orders/:id/confirm, POST} route +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [RoutesResolver] ProductsController {/products}: +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
  celilac-api  | [Nest] 1  - 11/10/2026, 4:43:55 PM     LOG [NestApplication] Nest application successfully started +1ms
  celilac-api  | Server is running on http://localhost:3200
  ```

### 3.4 Logs do Contêiner `celilac-postgres` (`docker compose logs --tail=5 postgres`)
```text
celilac-postgres  | 2026-10-31 18:29:11.430 UTC [1] LOG:  database system is ready to accept connections
celilac-postgres  | 2026-11-10 00:32:27.419 UTC [9330] LOG:  checkpoint starting: time
celilac-postgres  | 2026-11-10 00:32:29.616 UTC [9330] LOG:  checkpoint complete: wrote 22 buffers (0.1%); 0 WAL file(s) added, 0 removed, 0 recycled; write=2.184 s, sync=0.005 s, total=2.198 s; sync files=20, longest=0.003 s, average=0.001 s; distance=89 kB, estimate=182 kB; lsn=0/1A244D0, redo lsn=0/1A24478
```

---

## 4. Conclusão e Pendências

- **Conclusão:** O contêiner `celilac-api` (`PID 1` interno) inicializou o NestJS, conectou o `TypeOrmCoreModule` ao `celilac-postgres` via rede Docker (`DB_HOST=postgres:5432`), mapeou `POST /products` e expôs a porta `3200:3200` sem erros.
- **Próximo passo (Fases 9 e 10 — Artefato `10-07`):** Executar `POST http://localhost:3200/products`, consultar o PostgreSQL, reiniciar somente o contêiner `api` (`docker compose restart api`), comprovar a durabilidade do registro e reexecutar as suítes de testes.

