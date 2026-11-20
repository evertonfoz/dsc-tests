# ARTEFATO 08-04 — EXECUÇÃO DO FLUXO HTTP INTEGRADO COM COMPONENTES REAIS

> **Material 08 — Verificação Integrada do Backend e Preparação para Persistência Real**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API — NestJS, Vitest)  
> **Data de Emissão:** 19/11/2026  
> **Rastreabilidade:** Continuidade direta dos Materiais 01 a 07

---

## 1. Ambiente de Execução e Componentes Reais Conectados

Para a execução deste fluxo, o backend NestJS do CeliLac foi inicializado com **todos os componentes de produção reais**:
- **Pipeline HTTP:** Express + `ValidationPipe({ whitelist: true, transform: true })`.
- **Controller Real:** `ProductsController`.
- **Service Real:** `ProductsService`.
- **Identidade:** Geração de UUID v4 nativo via `node:crypto`.
- **Repositório Real:** `InMemoryProductsRepository` resolvido via token `PRODUCTS_REPOSITORY`.
- **Endpoint Exercitado:** `http://localhost:3210/products`.

---

## 2. Cenário 1 — Execução com Dados Válidos (Fluxo Integrado Completo)

### 2.1 Requisição HTTP Enviada (cURL)
```bash
curl -i -X POST http://localhost:3210/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Celular XYZ"}'
```

### 2.2 Resposta HTTP Real Recebida
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 73
ETag: W/"49-l7TIKtFz/eStAzuCogH3B/26QGc"
Date: Fri, 20 Nov 2026 01:25:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"productId":"15b2743a-b764-4da0-8ef7-a33f675559ed","name":"Celular XYZ"}
```

### 2.3 Rastreamento Passo a Passo dos 10 Pontos do Fluxo Integrado:
1. **Aplicação Inicializada:** Servidor HTTP ouvindo requisições na porta 3210.
2. **Rota HTTP Disponível:** Rota `POST /products` mapeada pelo NestJS Router.
3. **Validação Executada:** `ValidationPipe` validou o JSON de entrada com `CreateProductDto`.
4. **Controller Real Acionado:** `ProductsController.createProduct` recebeu a instância do DTO.
5. **Service Real Executado:** `ProductsService.createProduct('Celular XYZ')` foi invocado com o parâmetro `name`.
6. **Token Resolvido:** O container injetou a instância concreta de `InMemoryProductsRepository`.
7. **Repositório Concreto Acionado:** O método `save()` da instância em memória foi executado, inserindo a entidade `Product` no array interno `products`.
8. **Resposta HTTP Recebida:** Retornou com status `201 Created`.
9. **Identificador Gerado:** O UUID v4 `15b2743a-b764-4da0-8ef7-a33f675559ed` foi retornado no payload.
10. **Dados Preservados:** O campo `name: "Celular XYZ"` retornou inalterado.

---

## 3. Cenário 2 — Execução com Dados Inválidos (Rejeição na Fronteira HTTP)

### 3.1 Requisição HTTP Enviada (cURL)
```bash
curl -i -X POST http://localhost:3210/products \
  -H "Content-Type: application/json" \
  -d '{"name":""}'
```

### 3.2 Resposta HTTP Real Recebida
```http
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-vYNkcW5F6SbXFYfU19PSOJCiOds"
Date: Fri, 20 Nov 2026 01:25:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}
```

### 3.3 Análise e Ressalva Arquitetural Obrigatória:
- A requisição com nome vazio foi interceptada pelo `ValidationPipe` do NestJS na camada de entrada antes de acionar o método `createProduct` do Controller.
- **Ressalva Metodológica de Domínio:** A rejeição com `400 Bad Request` pelo pipe comprova a integridade da **fronteira HTTP** (sintaxe do DTO). Contudo, ela **não comprova** que a camada de domínio/serviço rejeitaria o dado caso fosse invocada diretamente em outro contexto (ex.: mensageria, fila assíncrona ou CLI sem o Pipe). A regra de negócio de domínio (critério `CA02`) pertence a um ciclo de TDD próprio de domínio.

---

## 4. Distinção Rigorosa: Resposta HTTP vs. Evidência de Armazenamento

Em Engenharia de Software, é imperativo manter rigor metodológico sobre o que cada evidência de teste comprova:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Resposta HTTP (JSON 201 com productId e name)                          │
│  - Comprova que a resposta foi serializada com sucesso na saída HTTP.  │
│  - Demonstra que o fluxo atravessou Controller e Service e retornou.   │
│  - NÃO equivale à inspeção direta do estado interno do repositório.    │
└────────────────────────────────────────────────────────────────────────┘
                                    ≠
┌────────────────────────────────────────────────────────────────────────┐
│ Inspeção Direta do Repositório (Estado Interno)                        │
│  - Exige verificar a coleção em memória (ex.: repositório.products)    │
│    ou a presença física do registro na tabela do banco de dados.       │
│  - Garante que os dados foram de fato persistidos no estado interno.   │
└────────────────────────────────────────────────────────────────────────┘
```

**Conclusão:** Não se pode afirmar que o armazenamento interno foi diretamente inspecionado apenas porque a resposta HTTP devolveu um identificador gerado. Essa delimitação será aprofundada na suíte de testes integrados automatizados (Artefato 08-05).
