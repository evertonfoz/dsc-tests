# ARTEFATO 08-04 — EXECUÇÃO HTTP INTEGRADA

## 1. Ambiente e Configuração da Execução Integrada

| Parâmetro | Valor Real Utilizado |
| :--- | :--- |
| **Sistema Operacional / Runtime** | macOS Darwin (arm64) / Node.js com NestJS `^12.1.2` (Express) |
| **Branch Ativa** | `feature/uc12-06-products-http` (`fd00b5a`) |
| **Comando de Inicialização** | `pnpm build` seguido de `node dist/main.js` (PID `93418`) |
| **Endereço e Endpoint** | `POST http://localhost:3200/products` |
| **Componentes Reais em Execução** | `ValidationPipe({ whitelist: true, transform: true })` → `CreateProductDto` → `ProductsController` → `ProductsService` → `PRODUCTS_REPOSITORY` → `InMemoryProductsRepository` |
| **Mocks Utilizados** | **Nenhum** (execução 100% com os componentes reais configurados em `ProductsModule` e `AppModule`). |

---

## 2. Cenário 1 — Requisição HTTP Válida com Componentes Reais

### 2.1 Comando e Payload Enviado
- **Requisição HTTP:**
  ```http
  POST /products HTTP/1.1
  Host: localhost:3200
  Content-Type: application/json

  {
    "name": "Celular XYZ"
  }
  ```
- **Comando executado:**
  ```bash
  curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name": "Celular XYZ"}'
  ```

### 2.2 Resposta HTTP Real Observada
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 73
ETag: W/"49-lfgF4N+FDwtGp5TY533unN6XEHg"
Date: Sun, 08 Nov 2026 22:23:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"5318b483-c21e-4b5a-ae37-7bd5542f9ef7","name":"Celular XYZ"}
```

### 2.3 Verificação dos 10 Pontos do Fluxo Integrado (Cenário Válido)
1. **Aplicação inicializada:** Confirmado (`[NestApplication] Nest application successfully started`).
2. **Rota disponível:** Confirmado (`Mapped {/products, POST} route`).
3. **Validação executada:** `ValidationPipe` validou `{"name": "Celular XYZ"}` contra `@IsString()` e `@IsNotEmpty()` de `CreateProductDto`.
4. **Controller acionado:** `ProductsController.create(dto)` recebeu o DTO validado.
5. **Service real utilizado:** `ProductsService.createProduct('Celular XYZ')` foi executado e gerou o UUID v4 real `5318b483-c21e-4b5a-ae37-7bd5542f9ef7`.
6. **Token de Repository resolvido:** O token `PRODUCTS_REPOSITORY` foi resolvido pelo container do `ProductsModule`.
7. **Implementação em memória disponível:** `InMemoryProductsRepository.save(product)` foi invocado e retornou a instância de `Product`.
8. **Resposta HTTP recebida:** Status `201 Created` retornado com `Content-Type: application/json; charset=utf-8`.
9. **`productId` retornado:** `"5318b483-c21e-4b5a-ae37-7bd5542f9ef7"` (string UUID válida).
10. **Nome preservado:** `"Celular XYZ"`.

---

## 3. Cenário 2 — Requisição HTTP Inválida (Nome Vazio)

### 3.1 Comando e Payload Enviado
- **Requisição HTTP:**
  ```http
  POST /products HTTP/1.1
  Host: localhost:3200
  Content-Type: application/json

  {
    "name": ""
  }
  ```
- **Comando executado:**
  ```bash
  curl -i -s -X POST http://localhost:3200/products \
    -H "Content-Type: application/json" \
    -d '{"name": ""}'
  ```

### 3.2 Resposta HTTP Real Observada
```http
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-vYNkcW5F6SbXFYfU19PSOJCiOds"
Date: Sun, 08 Nov 2026 22:23:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}
```

### 3.3 Análise Técnica do Cenário Inválido
- **Status observado:** `400 Bad Request` (compatível com o esperado na fronteira HTTP).
- **Corpo observado:** `{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}`.
- **Delimitação obrigatória sobre `CA02`:** Esta resposta comprova que a **fronteira HTTP** (`ValidationPipe` + `CreateProductDto` com `@IsNotEmpty()`) barra requisições com `name: ""` antes da execução de `ProductsController.create`. Entretanto, **não comprova** que a regra de negócio `CA02` esteja implementada dentro de `ProductsService.createProduct(name)` ou da entidade `Product` caso o serviço seja chamado diretamente fora da camada HTTP.

---

## 4. Distinção Metodológica: Resposta HTTP vs. Inspeção do Armazenamento

| Tipo de Evidência | O que foi observado nesta fase | O que ela comprova e seus limites |
| :--- | :--- | :--- |
| **Resposta HTTP (`201 Created` com JSON)** | `{"productId":"5318b483-c21e-4b5a-ae37-7bd5542f9ef7","name":"Celular XYZ"}` | Demonstra que a requisição percorreu `ProductsController` → `ProductsService` → `InMemoryProductsRepository.save()` e devolveu um objeto serializado compatível com o contrato `Product(productId, name)`. **Por si só, o JSON de resposta HTTP não constitui uma inspeção direta do array interno `products` do repositório.** |
| **Inspeção do Repository (`InMemoryProductsRepository`)** | O contrato `ProductsRepository` expõe apenas `save(product: Product): Promise<Product>`, e o atributo `private readonly products: Product[] = []` é privado. | Para verificar o estado interno ou a chamada efetiva a `save(product)` sem alterar o contrato de produção nem criar endpoints extras (`GET`), é necessário utilizar recursos do ambiente de testes automatizados (como `moduleRef.get(PRODUCTS_REPOSITORY)` em conjunto com espionagem controlada `vi.spyOn` sobre a instância real ou inspeção em memória no teste integrado da Fase 7/8). |

---

## 5. Conclusões da Fase 6

1. O fluxo HTTP integrado com componentes reais (`ProductsController` + `ProductsService` + `InMemoryProductsRepository`) funciona conforme especificado tanto para o cenário válido (`201 Created`) quanto para a rejeição na fronteira HTTP (`400 Bad Request`).
2. A verificação manual via `curl` não substitui um teste automatizado integrado reproduzível na suíte Vitest, o qual será implementado e executado a seguir na **Fase 7**.

