# ARTEFATO 13-07 — MATRIZ DE EVIDÊNCIAS HTTP E RELAÇÃO COM TESTES

## 1. Visão Geral da Matriz de Evidências
Este documento consolida a matriz comparativa entre os diferentes níveis de verificação da API CeliLac (manual, automatizada via shell script e suítes de testes automatizados com Vitest/Supertest).

---

## 2. Matriz Consolidada de Execução e Resultados

| Nível | Ferramenta / Mecanismo | Executado? | Resultado Real Obtido | Observações e Escopo |
|---|---|:---:|---|---|
| **Manual** | REST Client (`.http`) | **Sim** | Requisições estruturadas com `@baseUrl`, títulos explicativos e captura `# @name`. | Permite inspeção visual interativa via extensão no editor; sem asserção automática. |
| **Manual** | `curl -i` | **Sim** | 9 requisições executadas: `GET /` (200), `GET 404` (404), `POST /products` (201 com UUID), nome vazio (400), ausente (400), tipo inválido (400), extra (201 whitelist), pedidos inválido (400) e inexistente (404). | Validação pontual de cabeçalhos HTTP, códigos de status e formatos JSON de payload. |
| **Automatizado** | `run-checks.sh` | **Sim** | **14 ok, 0 falha(s)** (código de saída: `0`). | Verificação determinística contínua de contêineres, migrations, contratos do UC12 e persistência SQL. |
| **Automatizado** | `run-checks.sh --durability` | **Sim** | **16 ok, 0 falha(s)** (código de saída: `0`). | Reinicia somente o contêiner `api`, aguarda disponibilidade e comprova sobrevivência do dado no Postgres. |
| **Automatizado (Falha)** | `run-checks.sh` (porta 9) | **Sim** | **4 ok, 10 falha(s)** (código de saída: `1`). | Prova documental de capacidade de detecção de falhas e ausência de falsos positivos. |
| **Testes (Rápida)** | Vitest (`src/modules/products/`) | **Sim** | **6 testes aprovados** (3 controller, 2 integração NestJS, 1 unitário service). | Execução em memória com dublês controlados; duração: ~550ms. |
| **Testes (Persistência)** | Vitest (`typeorm-products.repository.postgres.spec.ts`) | **Sim** | **1 teste aprovado** (32ms). | Persistência real executando contra contêiner isolado de teste (`celilac-postgres-test`, porta 5435). |
| **Testes (E2E)** | Vitest E2E (`vitest.config.e2e.ts`) | **Não** | **Não executado — risco ao banco de desenvolvimento.** | A suíte existente (`test/orders/confirm-order.e2e-spec.ts`) conecta-se à base de desenvolvimento (`celilac_db`) e não cobre `products`. |

---

## 3. Relação e Diferenciação Entre os Níveis de Verificação

### 3.1. Arquivos `.http` vs. `run-checks.sh`
* **`.http`:** Atuam como documentação viva e executável para o desenvolvedor durante o ciclo de trabalho manual. Não possuem lógica de asserção, dependendo da interpretação humana do status e payload.
* **`run-checks.sh`:** Atua como pipeline local ou gate de verificação automatizada. Compara strings e números, emite contadores e sinaliza sucesso ou falha através do código de retorno do processo Unix (`$?`).

### 3.2. Verificação HTTP em Execução vs. Testes Automatizados (Vitest)
* **Verificação em Execução (`run-checks.sh` / `.http`):** Testa a aplicação "de ponta a ponta" como uma caixa-preta já empacotada e em execução na rede (`http://localhost:3200`), validando a orquestração do Docker Compose, a integridade do banco e a comunicação TCP/HTTP.
* **Testes Automatizados de Unidade e Integração:** Verificam o código-fonte em tempo de compilação/teste, isolando camadas, testando casos extremos de regras de negócio internas e provendo feedback em milissegundos.
* **Princípio:** Um nível não substitui o outro; ambos se complementam na garantia da qualidade e operabilidade do sistema.

---

## 4. Análise de Risco da Suíte E2E
A inspeção detalhada de `test/orders/confirm-order.e2e-spec.ts` demonstrou que o teste instancia o `AppModule` completo, herdando a conexão com o banco de desenvolvimento (`celilac_db`). Além disso, não há testes E2E para o caso de uso `UC12 — Cadastrar Produto` nesta suíte. 

Por política estrita de segurança e não contaminação de bases persistentes, a não execução da suíte E2E foi mantida e justificada tecnicamente.
