# ARTEFATO 11-04 — SEMÂNTICA HTTP E RESPOSTAS DE ERRO

## 1. Análise da Configuração de Validação Global

Em `src/main.ts` (e replicada nos testes HTTP de `products.controller.spec.ts`), a aplicação utiliza:

```typescript
new ValidationPipe({
  whitelist: true,
  transform: true,
})
```

- **`whitelist: true`:** Remove silenciosamente propriedades recebidas no JSON que não possuam decoradores de validação no `CreateProductDto`, impedindo que dados extras cheguem ao Controller ou ao Service.
- **`forbidNonWhitelisted: true`:** Não está habilitado. Sua ativação faria a API retornar `400 Bad Request` diante de propriedades extras, alterando o comportamento atual de tolerância/limpeza de entrada. Decisão: **preservar a configuração atual** (`whitelist: true`, `transform: true`) sem introduzir mudança de comportamento não solicitada.
- **Erros de aplicação:** Não foram inventados códigos `404`, `409` ou `422`, pois não há requisito confirmado para esses cenários em `POST /products`.
- **Falhas inesperadas:** Nenhuma operação destrutiva foi provocada contra o PostgreSQL. O NestJS trata exceções não capturadas com resposta padrão `500 Internal Server Error` sem expor *stack traces* ou credenciais em produção.

---

## 2. Matriz de Verificação (Observada na API Containerizada)

| Cenário | Entrada (`POST /products`) | Resultado Esperado | Resultado Observado | Status HTTP | Estrutura JSON Observada | Divergências | Decisão |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Cadastro válido** | `{"name":"Produto de exemplo"}` | Criação com `productId` e `name` | Recurso criado e serializado via `ProductResponseDto` | `201 Created` | `{"productId":"42e3bb18-e111-455b-bca4-884d5a6e14e9","name":"Produto de exemplo"}` | Nenhuma | Preservar |
| **Nome vazio (`FA01`)** | `{"name":""}` | Rejeição na fronteira HTTP sem persistir | Rejeitado pelo `ValidationPipe` | `400 Bad Request` | `{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}` | Nenhuma | Preservar |
| **Propriedade extra (`whitelist`)** | `{"name":"Produto whitelist","extraField":"ignored"}` | Propriedade não listada removida; criação normal | `extraField` descartada antes do Controller | `201 Created` | `{"productId":"ce7d2be6-18e3-4efc-b8d8-ca7ffcb93dd2","name":"Produto whitelist"}` | Nenhuma | Preservar `whitelist: true` |
| **Campo `name` ausente** | `{}` | Rejeição por ausência de campo obrigatório | Rejeitado por `@IsNotEmpty()` e `@IsString()` | `400 Bad Request` | `{"message":["name should not be empty","name must be a string"],"error":"Bad Request","statusCode":400}` | Nenhuma | Preservar |
| **Tipo inválido para `name`** | `{"name":123}` | Rejeição por tipo incorreto | Rejeitado por `@IsString()` | `400 Bad Request` | `{"message":["name must be a string"],"error":"Bad Request","statusCode":400}` | Nenhuma | Preservar |

---

## 3. Conclusão

A semântica HTTP do endpoint `POST /products` encontra-se consistente com os requisitos documentados (`201 Created` para sucesso, `400 Bad Request` para entrada inválida), mantendo a configuração de `ValidationPipe` original e sem exposição de detalhes internos.

