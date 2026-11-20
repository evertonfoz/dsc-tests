# ARTEFATO 13-03 — CENÁRIOS DO CASO DE USO (UC12 — CADASTRAR PRODUTO)

## 1. Mapeamento do Contrato do Caso de Uso
O caso de uso `UC12 — Cadastrar Produto` expõe o endpoint `POST /products`. Os cenários foram derivados rigorosamente do código-fonte:
* **Entrada:** `CreateProductDto` (`name: string`, decorado com `@IsString()` e `@IsNotEmpty()`).
* **Pipes:** `ValidationPipe` global com `whitelist: true` e `transform: true`.
* **Saída:** `ProductResponseDto` (`{ productId: string, name: string }`).

---

## 2. Execução Real e Tabela de Resultados

| # | Cenário | Método e Payload | Esperado | Obtido | Conclusão |
|---|---|---|---|---|---|
| **1** | Cadastro válido (critério de aceite principal) | `POST /products`<br>`{"name": "Biscoito de Polvilho Sem Glúten"}` | `201 Created`<br>Corpo com `productId` (UUID) e `name` idêntico | `201 Created`<br>`{"productId":"5ee124f9-9d6f-41ac-8fd7-f67037da261f","name":"Biscoito de Polvilho Sem Glúten"}` | **Aprovado** (contrato íntegro e UUID gerado) |
| **2** | Campo obrigatório vazio | `POST /products`<br>`{"name": ""}` | `400 Bad Request`<br>Mensagem: `name should not be empty` | `400 Bad Request`<br>`{"message":["name should not be empty"],"error":"Bad Request","statusCode":400}` | **Aprovado** (validador `@IsNotEmpty` atuando) |
| **3** | Campo obrigatório ausente | `POST /products`<br>`{}` | `400 Bad Request`<br>Mensagens de ausência e tipo string | `400 Bad Request`<br>`{"message":["name should not be empty","name must be a string"],"error":"Bad Request","statusCode":400}` | **Aprovado** (validação de obrigatoriedade completa) |
| **4** | Tipo de dado inválido (numérico) | `POST /products`<br>`{"name": 99999}` | `400 Bad Request`<br>Mensagem: `name must be a string` | `400 Bad Request`<br>`{"message":["name must be a string"],"error":"Bad Request","statusCode":400}` | **Aprovado** (validador `@IsString` atuando) |
| **5** | Propriedade extra enviada (whitelist) | `POST /products`<br>`{"name": "Massa de Pizza Sem Glúten", "campoExtra": "descartar"}` | `201 Created`<br>Corpo sem o campo `campoExtra` | `201 Created`<br>`{"productId":"1c9e70e9-6e0b-42f4-9192-5bbc0f13053a","name":"Massa de Pizza Sem Glúten"}` | **Aprovado** (descarte confirmado por `whitelist: true`) |

---

## 3. Encadeamento Dinâmico com REST Client
No arquivo `http-rest-client/containerizado/01-products-cadastrar-produto.http`, foi implementado o encadeamento:

```http
### Cenário 1: Cadastro válido com encadeamento de resposta → esperado: 201 Created
# @name criarProduto
POST {{baseUrl}}/products
Content-Type: application/json

{
  "name": "Bolo de Milho Sem Glúten e Sem Lactose"
}

### Guarde o identificador da resposta acima para a consulta SQL direta no banco
@produtoId = {{criarProduto.response.body.productId}}
```

### Comportamento Comprovado
* A diretiva `# @name criarProduto` rotula a requisição.
* A extensão REST Client armazena a resposta em memória.
* A expressão `{{criarProduto.response.body.productId}}` extrai dinamicamente o UUID gerado, permitindo que requisições subsequentes ou consultas no banco de dados usem o mesmo identificador sem intervenção manual.
