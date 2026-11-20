# ARTEFATO 10-06 — MIGRATIONS E INICIALIZAÇÃO NO AMBIENTE CONTAINERIZADO

## 1. Contexto e Objetivos

O objetivo desta fase é verificar o comportamento das migrations compiladas dentro do contêiner da aplicação, consultar o histórico de migrations em `celilac_db` e inicializar o serviço `api` garantindo que o NestJS suba com seus módulos, controladores e rotas plenamente operacionais.

---

## 2. Inspeção do Histórico de Migrations no Contêiner

Antes de inicializar o servidor HTTP, o histórico de migrations registradas no banco de desenvolvimento foi auditado de dentro do contêiner da API usando o script compilado:

```bash
docker compose run --rm api pnpm migration:show:prod
```

### Evidência Real da Execução:

```text
[+] create 1/1
 ✔ Container celilac-postgres Running                                       0.0s
Container celilac-postgres Healthy 
Container celilac-backend-api-run-f21d33d4ea8a Creating 
Container celilac-backend-api-run-f21d33d4ea8a Created 

$ typeorm migration:show -d dist/database/data-source.js
[X] 1 CreateOrders1792519198708
[X] 6 CreateProductsTable1794255600000
```

### Análise do Resultado:
- Ambas as migrations constam como aplicadas (`[X]`), incluindo a migration fundamental do caso de uso `UC12` (`CreateProductsTable1794255600000`).
- **Nenhuma migration pendente foi encontrada (`[ ]`).**
- Em conformidade com o princípio de conservação e não execução de comandos redundantes ou destrutivos, **nenhuma migration adicional precisou ser executada**, preservando intacto o histórico existente no volume persistente.

---

## 3. Inicialização dos Serviços via Docker Compose

Com o DataSource e o histórico de migrations validados, o serviço da API foi inicializado em modo detached:

```bash
docker compose up -d api
```

### Estado dos Contêineres (`docker compose ps`):

```text
NAME                    IMAGE             COMMAND                  SERVICE         CREATED          STATUS                    PORTS
celilac-api             celilac-api:dev   "docker-entrypoint.s…"   api             3 seconds ago    Up Less than a second     0.0.0.0:3200->3200/tcp, [::]:3200->3200/tcp
celilac-postgres        postgres:17       "docker-entrypoint.s…"   postgres        29 minutes ago   Up 29 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
celilac-postgres-test   postgres:17       "docker-entrypoint.s…"   postgres_test   7 days ago       Up 7 days (healthy)       0.0.0.0:5435->5432/tcp, [::]:5435->5432/tcp
```

---

## 4. Inspeção dos Logs de Inicialização

A inspeção em tempo real dos logs da API e do PostgreSQL comprovou a inicialização sem erros:

### Logs da API (`docker compose logs api`):

```text
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [NestFactory] Starting Nest application...
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +5ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +1ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] AppModule dependencies initialized +10ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +9ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] OrdersModule dependencies initialized +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [RoutesResolver] AppController {/}: +5ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [RouterExplorer] Mapped {/, GET} route +1ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [RoutesResolver] OrdersController {/orders}: +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [RouterExplorer] Mapped {/orders/:id/confirm, POST} route +1ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [RoutesResolver] ProductsController {/products}: +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [RouterExplorer] Mapped {/products, POST} route +0ms
celilac-api  | [Nest] 1  - 11/20/2026, 12:51:11 PM     LOG [NestApplication] Nest application successfully started +0ms
celilac-api  | Server is running on http://localhost:3200
```

### Conclusões da Inicialização:
1. `TypeOrmCoreModule` conectou com sucesso ao serviço `postgres` através da rede interna do Compose.
2. `ProductsModule` teve todas as suas dependências (`ProductsService`, `TypeOrmProductsRepository`, `ProductOrmEntity`) injetadas corretamente.
3. A rota `{/products, POST}` foi mapeada com sucesso pelo NestJS no endpoint HTTP exposto na porta 3200.
