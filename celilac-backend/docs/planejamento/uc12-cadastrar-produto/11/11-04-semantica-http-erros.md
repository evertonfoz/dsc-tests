# ARTEFATO 11-04 — SEMÂNTICA HTTP E ANÁLISE DE RESPOSTAS DE ERRO

## 1. Princípios da Semântica HTTP no CeliLac

A especificação REST estabelece que as respostas da API devem refletir com precisão a semântica do protocolo HTTP:
- **Operação de Criação com Sucesso:** Devolve `201 Created` e os dados do recurso criado.
- **Entrada do Cliente Inválida:** Devolve `400 Bad Request` com a discriminação dos erros sem expor detalhes internos.
- **Estrutura Padronizada:** Erros devem fornecer informações acionáveis ao cliente (status, tipo do erro e lista de mensagens).

---

## 2. Matriz de Verificação Semântica da API

Todos os cenários foram testados diretamente contra o contêiner em execução `celilac-api` (porta 3200):

| Cenário de Teste | Payload Enviado | Status Esperado | Status Observado | Cabeçalho `Content-Type` | Estrutura JSON Observada | Diagnóstico Técnico |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **1. Sucesso Válido** | `{"name":"Bolo de Cenoura Sem Gluten"}` | `201 Created` | `201 Created` | `application/json; charset=utf-8` | `{"productId":"9a02a4af-6c2d-4752-b218-1ea119916624","name":"Bolo de Cenoura Sem Gluten"}` | **Confirmado:** Apenas os campos públicos definidos são retornados. |
| **2. Entrada com Propriedade Extra** | `{"name":"Pao Frances Sem Gluten","extraProperty":"ignored"}` | `201 Created` | `201 Created` | `application/json; charset=utf-8` | `{"productId":"48e580f3-b467-48e3-8030-dd9ae54a3f38","name":"Pao Frances Sem Gluten"}` | **Confirmado:** O `ValidationPipe` com `whitelist: true` removeu silenciosamente o campo não mapeado `extraProperty`. O mapper HTTP garantiu a saída pura. |
| **3. Nome Vazio** | `{"name":""}` | `400 Bad Request` | `400 Bad Request` | `application/json; charset=utf-8` | `{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}` | **Confirmado:** `@IsNotEmpty()` disparou a mensagem esperada. Nenhum detalhe interno revelado. |
| **4. Corpo Vazio** | `{}` | `400 Bad Request` | `400 Bad Request` | `application/json; charset=utf-8` | `{"message":["name should not be empty","name must be a string"],"error":"Bad Request","statusCode":400}` | **Confirmado:** Ambos os decorators (`@IsString()` e `@IsNotEmpty()`) relataram a ausência do campo. |
| **5. Tipo Incompatível** | `{"name":12345}` | `400 Bad Request` | `400 Bad Request` | `application/json; charset=utf-8` | `{"message":["name must be a string"],"error":"Bad Request","statusCode":400}` | **Confirmado:** `@IsString()` rejeitou número com mensagem precisa. |

---

## 3. Análise da Proteção contra Vazamento de Detalhes Internos

Durante a inspeção das respostas de erro (`400 Bad Request`):
1. **Ausência de Stack Traces:** Nenhum traço de execução, caminho de arquivos locais ou referências a módulos internos é retornado ao cliente.
2. **Ausência de Nomes de Esquemas ou Tabelas:** O erro é restrito ao contrato do DTO (`name`), sem qualquer menção à tabela `products.products` ou colunas do PostgreSQL.
3. **Ausência de Informações Sensíveis:** Credenciais de banco, segredos ou variáveis de ambiente permanecem totalmente isolados.

---

## 4. Avaliação sobre `whitelist: true` vs. `forbidNonWhitelisted: true`

O projeto mantém em `src/main.ts` e nos testes unitários:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
```

### Análise de Impacto:
- Com `whitelist: true`, campos não reconhecidos enviados no payload JSON são descartados antes de atingir a lógica do Controller.
- Se a equipe adotasse `forbidNonWhitelisted: true`, requisições com campos extras seriam rejeitadas com `400 Bad Request`.
- **Decisão:** Manter `whitelist: true` conforme a convenção consolidada do projeto, garantindo compatibilidade retroativa com clientes que possam enviar metadados adicionais sem causar quebra do serviço.
